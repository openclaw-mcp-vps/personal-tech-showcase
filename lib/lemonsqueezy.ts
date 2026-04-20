import crypto from "crypto";

import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

interface CheckoutInput {
  email?: string;
  customData?: Record<string, string>;
}

function ensureOverlayQuery(urlString: string) {
  const url = new URL(urlString);
  url.searchParams.set("embed", "1");
  url.searchParams.set("media", "0");
  url.searchParams.set("logo", "0");
  return url.toString();
}

export function getLemonCheckoutUrl() {
  const raw = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;

  if (!raw) {
    return null;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return ensureOverlayQuery(raw);
  }

  return ensureOverlayQuery(`https://app.lemonsqueezy.com/checkout/buy/${raw}`);
}

export async function createHostedCheckout(input: CheckoutInput) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const storeId = Number(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID);
  const variantId = Number(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID);

  if (!apiKey || !Number.isFinite(storeId) || !Number.isFinite(variantId)) {
    return null;
  }

  lemonSqueezySetup({ apiKey });

  const checkout = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: input.email,
      custom: input.customData
    },
    checkoutOptions: {
      embed: true,
      media: false,
      logo: false
    }
  });

  return checkout.data?.data.attributes.url ?? null;
}

export function verifyLemonSignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
