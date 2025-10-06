import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "../../../../../prisma/client";
import type { SubscriptionPlan, SubscriptionStatus, PaymentStatus } from "@prisma/client";
import Stripe from "stripe";

// Helper to format dates nicely
const formatDate = (date: Date) =>
  date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId)
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.subscription)
      return NextResponse.json({ error: "No subscription found" }, { status: 400 });

    const userId = session.metadata?.id;
    const planTypeStr = session.metadata?.planType;

    if (!userId || !planTypeStr)
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });

    const planType = planTypeStr.toUpperCase() as SubscriptionPlan;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId)
      return NextResponse.json({ error: "No subscription ID found" }, { status: 400 });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
    const subscriptionStatus = subscription.status.toUpperCase() as SubscriptionStatus;

    const nextBilling = subscription.current_period_end
      ? formatDate(new Date(subscription.current_period_end * 1000))
      : "N/A";


    const dbSubscription = await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscriptionStatus,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: planType,
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: planType,
        status: subscriptionStatus,
      },
    });

    let payments: any[] = [];

    if (session.payment_intent) {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id;

      let paymentIntent: Stripe.PaymentIntent | undefined;
      for (let i = 0; i < 5; i++) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === "succeeded") break;
        await new Promise((res) => setTimeout(res, 1000));
      }

      if (paymentIntent) {
        const paymentStatus = paymentIntent.status.toUpperCase() as PaymentStatus;
        const paymentDate = paymentIntent.created
          ? formatDate(new Date(paymentIntent.created * 1000))
          : "N/A";

        const dbPayment = await prisma.payment.upsert({
          where: { stripePaymentId: paymentIntent.id },
          update: {
            status: paymentStatus,
            amount: paymentIntent.amount_received,
            currency: paymentIntent.currency,
          },
          create: {
            stripePaymentId: paymentIntent.id,
            userId,
            subscriptionId: dbSubscription.id,
            amount: paymentIntent.amount_received,
            currency: paymentIntent.currency,
            status: paymentStatus,
          },
        });

        payments.push({
          id: dbPayment.id,
          amount: dbPayment.amount,
          currency: dbPayment.currency,
          status: dbPayment.status,
          date: paymentDate,
        });
      }
    }

    const customerName = session.customer_details?.name || session.metadata?.name || "N/A";
    const customerEmail = session.customer_details?.email || session.metadata?.email || "N/A";

    return NextResponse.json({
      message: "Subscription and payment recorded",
      subscriptionId: dbSubscription.id,
      stripeSubscriptionId: dbSubscription.stripeSubscriptionId,
      plan: dbSubscription.plan,
      status: dbSubscription.status,
      nextBilling,
      customerName,
      customerEmail,
      payments,
    });
  } catch (error: any) {
    console.error("Success route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
