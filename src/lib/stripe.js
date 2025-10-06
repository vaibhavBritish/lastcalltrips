import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_ESSENTIAL_PRICE_ID) {
  throw new Error('STRIPE_ESSENTIAL_PRICE_ID is not set');
}

if (!process.env.STRIPE_PREMIUM_PRICE_ID) {
  throw new Error('STRIPE_PREMIUM_PRICE_ID is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// quick runtime check (optional)
async function verifyStripePrice() {
  try {
    const testPrice = await stripe.prices.retrieve("price_1S9JaQAqEFmkn3JuGp0ZGJV6");
    console.log("✅ Stripe price found:", testPrice.id, testPrice.unit_amount, testPrice.currency);
  } catch (err) {
    console.error("❌ Stripe price not found:", err.message);
  }
}

// only run in dev
if (process.env.NODE_ENV === "development") {
  verifyStripePrice();
}

export const STRIPE_CONFIG = {
  plans: {
    essential: {
      name: "Essential Plan",
      priceId: process.env.STRIPE_ESSENTIAL_PRICE_ID,
      price: 3599, // $35.99 in cents
    },
    premium: {
      name: "Premium Plan",
      priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
      price: 5999, // $59.99 in cents
    },
  },
  currency: "usd",
};
