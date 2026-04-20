import { NextResponse } from "next/server";
import { z } from "zod";

import { createHostedCheckout, getLemonCheckoutUrl } from "@/lib/lemonsqueezy";

const bodySchema = z.object({
  email: z.string().email().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const hostedCheckout = await createHostedCheckout({
    email: parsed.data.email,
    customData: {
      source: "personal-tech-showcase"
    }
  });

  const fallbackCheckout = getLemonCheckoutUrl();
  const checkoutUrl = hostedCheckout ?? fallbackCheckout;

  if (!checkoutUrl) {
    return NextResponse.json(
      {
        error: "Lemon Squeezy checkout is not configured. Set NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ checkoutUrl });
}
