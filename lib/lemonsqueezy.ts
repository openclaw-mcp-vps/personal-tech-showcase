import crypto from "node:crypto";

import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

interface LemonPayload {
  meta?: {
    event_name?: string;
    custom_data?: {
      checkout_token?: string;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      user_email?: string;
      customer_email?: string;
      custom_data?: {
        checkout_token?: string;
      };
    };
  };
}

export function initLemonSqueezy() {
  if (!process.env.LEMON_SQUEEZY_API_KEY) return;

  lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });
}

export function buildLemonCheckoutUrl(input: {
  storeId: string;
  productId: string;
  checkoutToken: string;
  successUrl: string;
}) {
  const baseUrl = input.productId.startsWith("http")
    ? new URL(input.productId)
    : new URL(`https://checkout.lemonsqueezy.com/buy/${input.productId}`);

  baseUrl.searchParams.set("embed", "1");
  baseUrl.searchParams.set("media", "0");
  baseUrl.searchParams.set("store", input.storeId);
  baseUrl.searchParams.set("checkout[dark]", "true");
  baseUrl.searchParams.set("checkout[custom][checkout_token]", input.checkoutToken);
  baseUrl.searchParams.set("checkout[success_url]", input.successUrl);

  return baseUrl.toString();
}

export function verifyLemonSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export function extractCheckoutToken(payload: LemonPayload): string | null {
  return (
    payload.meta?.custom_data?.checkout_token ||
    payload.data?.attributes?.custom_data?.checkout_token ||
    null
  );
}

export function isPaidLemonEvent(payload: LemonPayload): boolean {
  const eventName = payload.meta?.event_name ?? "";
  const status = payload.data?.attributes?.status ?? "";

  return (
    [
      "order_created",
      "order_paid",
      "subscription_created",
      "subscription_payment_success"
    ].includes(eventName) ||
    ["paid", "active"].includes(status)
  );
}

export function extractCustomerEmail(payload: LemonPayload): string | null {
  return (
    payload.data?.attributes?.user_email ||
    payload.data?.attributes?.customer_email ||
    null
  );
}
