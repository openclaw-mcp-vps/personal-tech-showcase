import { NextRequest, NextResponse } from "next/server";

import { getCheckoutStatus } from "@/lib/paywall";

const CHECKOUT_COOKIE = "pts_checkout";
const ACCESS_COOKIE = "pts_paid";

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const checkoutToken = request.cookies.get(CHECKOUT_COOKIE)?.value ?? null;

  const checkoutStatus = await getCheckoutStatus(checkoutToken);

  if (checkoutStatus !== "paid") {
    return NextResponse.redirect(new URL("/?payment=pending", origin));
  }

  const response = NextResponse.redirect(new URL("/dashboard?payment=success", origin));

  response.cookies.set(ACCESS_COOKIE, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
