import { NextResponse } from "next/server";

import { verifyLemonSignature } from "@/lib/lemonsqueezy";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature");
  const rawBody = await request.text();

  if (!verifyLemonSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid Lemon Squeezy signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    meta?: { event_name?: string; custom_data?: Record<string, string> };
    data?: { id?: string; attributes?: { user_email?: string } };
  };

  const supabase = getSupabaseServiceClient();
  if (supabase) {
    await supabase.from("lemon_webhook_events").insert({
      event_name: payload.meta?.event_name ?? "unknown",
      event_id: payload.data?.id ?? null,
      customer_email: payload.data?.attributes?.user_email ?? null,
      raw_payload: payload
    });
  }

  return NextResponse.json({ received: true });
}
