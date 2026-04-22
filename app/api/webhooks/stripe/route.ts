import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { grantAccess } from "@/lib/access";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!signature || !secret || !stripeSecretKey) {
    return NextResponse.json(
      {
        error: "Missing Stripe webhook configuration",
      },
      { status: 500 },
    );
  }

  const payload = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Webhook verification failed: ${
          error instanceof Error ? error.message : "unknown"
        }`,
      },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email?.toLowerCase() ||
      session.customer_email?.toLowerCase();

    if (email) {
      await grantAccess(email, "stripe", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
