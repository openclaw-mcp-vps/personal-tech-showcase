import crypto from "node:crypto";

export function getCheckoutUrl(): string {
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
  if (!productId) {
    return "";
  }

  return `https://checkout.lemonsqueezy.com/buy/${productId}?embed=1`;
}

export function verifyLemonSignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const expected = Buffer.from(hmac, "utf8");
  const received = Buffer.from(signature ?? "", "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}
