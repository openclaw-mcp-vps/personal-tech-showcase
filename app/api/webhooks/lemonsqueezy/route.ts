import { NextRequest, NextResponse } from "next/server";
import { grantAccess } from "@/lib/access";
import {
  extractLemonSqueezyEmail,
  parseLemonSqueezyWebhook,
  verifyLemonSqueezySignature,
} from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let eventName = "unknown";

  try {
    const event = parseLemonSqueezyWebhook(rawBody);
    eventName = event.meta.event_name;

    if (
      event.meta.event_name === "subscription_created" ||
      event.meta.event_name === "subscription_resumed" ||
      event.meta.event_name === "order_created"
    ) {
      const email = extractLemonSqueezyEmail(event);

      if (email) {
        await grantAccess(email, "lemonsqueezy", String(event.data.id));
      }
    }

    return NextResponse.json({ received: true, event: eventName });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid webhook payload",
        event: eventName,
      },
      { status: 400 },
    );
  }
}
