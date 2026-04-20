import { NextRequest, NextResponse } from "next/server";

import {
  extractCheckoutToken,
  extractCustomerEmail,
  isPaidLemonEvent,
  verifyLemonSignature
} from "@/lib/lemonsqueezy";
import { markCheckoutAsPaid } from "@/lib/paywall";
import { saveLemonWebhookEvent } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";

  if (secret && !verifyLemonSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    data?: {
      id?: string;
    };
  };

  await saveLemonWebhookEvent(payload);

  if (isPaidLemonEvent(payload)) {
    const checkoutToken = extractCheckoutToken(payload);

    if (checkoutToken) {
      await markCheckoutAsPaid({
        token: checkoutToken,
        orderId: payload.data?.id,
        customerEmail: extractCustomerEmail(payload)
      });
    }
  }

  return NextResponse.json({ received: true });
}
