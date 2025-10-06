import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "../../../../../prisma/client";
import { SubscriptionPlan, SubscriptionStatus, PaymentStatus } from "@prisma/client";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function mapStripePaymentStatus(stripeStatus: string): PaymentStatus {
  switch (stripeStatus.toLowerCase()) {
    case "requires_payment_method":
    case "requires_action":
    case "processing":
      return PaymentStatus.PENDING;
    case "succeeded":
      return PaymentStatus.SUCCEEDED;
    case "canceled":
      return PaymentStatus.CANCELED;
    case "requires_capture":
    case "failed":
      return PaymentStatus.FAILED;
    default:
      return PaymentStatus.PENDING;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig as string, webhookSecret as string);
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.id;
        const planTypeStr = session.metadata?.planType?.toUpperCase();
        if (!userId || !planTypeStr) break;

        let planEnum: SubscriptionPlan;
        switch (planTypeStr) {
          case "BASIC":
            planEnum = SubscriptionPlan.ESSENTIAL;
            break;
          case "PREMIUM":
            planEnum = SubscriptionPlan.PREMIUM;
            break;
          default:
            console.error(`Unknown plan type: ${planTypeStr}`);
            return new NextResponse("Invalid plan type", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
        if (!currentPeriodEnd) break;

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
            plan: planEnum,
          },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
            plan: planEnum,
            status: subscription.status.toUpperCase() as SubscriptionStatus,
          },
        });

        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as any; // Stripe types can be tricky here
        const subscriptionId = invoice.subscription as string | undefined;
        if (!subscriptionId) break;

        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });
        if (!dbSubscription) break;

        if (invoice.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent as string);
          const paymentStatus = mapStripePaymentStatus(paymentIntent.status);
          await prisma.payment.upsert({
            where: { stripePaymentId: paymentIntent.id },
            update: {
              status: paymentStatus,
              amount: paymentIntent.amount_received || invoice.amount_paid,
              currency: paymentIntent.currency || invoice.currency,
            },
            create: {
              stripePaymentId: paymentIntent.id,
              userId: dbSubscription.userId,
              subscriptionId: dbSubscription.id,
              amount: paymentIntent.amount_received || invoice.amount_paid,
              currency: paymentIntent.currency || invoice.currency,
              status: paymentStatus,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
        if (!currentPeriodEnd) break;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: SubscriptionStatus.CANCELED },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
