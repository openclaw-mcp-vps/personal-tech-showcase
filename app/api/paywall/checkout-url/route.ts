import { NextRequest, NextResponse } from "next/server";

import { buildLemonCheckoutUrl } from "@/lib/lemonsqueezy";
import { createCheckoutToken, recordCheckoutIntent } from "@/lib/paywall";

const CHECKOUT_COOKIE = "pts_checkout";

export async function GET(request: NextRequest) {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;

  if (!storeId || !productId) {
    return NextResponse.json(
      {
        error:
          "Lemon Squeezy is not configured. Set NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID and NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID."
      },
      { status: 500 }
    );
  }

  const token = createCheckoutToken();
  const username = request.cookies.get("gh_username")?.value ?? null;
  await recordCheckoutIntent(token, username);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const checkoutUrl = buildLemonCheckoutUrl({
    storeId,
    productId,
    checkoutToken: token,
    successUrl: `${origin}/api/paywall/verify`
  });

  const response = NextResponse.json({ url: checkoutUrl });
  response.cookies.set(CHECKOUT_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2
  });

  return response;
}
