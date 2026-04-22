import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const LemonSqueezyWebhookEventSchema = z.object({
  meta: z.object({
    event_name: z.string(),
  }),
  data: z.object({
    id: z.string().or(z.number()),
    attributes: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type LemonSqueezyWebhookEvent = z.infer<typeof LemonSqueezyWebhookEventSchema>;

export function verifyLemonSqueezySignature(rawBody: string, signature?: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}

export function parseLemonSqueezyWebhook(rawBody: string) {
  const payload = JSON.parse(rawBody);

  return LemonSqueezyWebhookEventSchema.parse(payload);
}

export function extractLemonSqueezyEmail(event: LemonSqueezyWebhookEvent) {
  const attributes = event.data.attributes;

  if (!attributes) {
    return null;
  }

  const email = attributes.user_email;

  return typeof email === "string" ? email.toLowerCase().trim() : null;
}
