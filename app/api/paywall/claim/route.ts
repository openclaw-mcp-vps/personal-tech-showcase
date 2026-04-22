import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createPaidCookieValue,
  hasAccess,
  paidCookieMetadata,
  paidCookieName,
} from "@/lib/access";

const ClaimSchema = z.object({
  email: z.string().trim().email("Enter the same email you used at checkout"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = ClaimSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid email",
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const accessGranted = await hasAccess(email);

  if (!accessGranted) {
    return NextResponse.json(
      {
        error:
          "No paid record found for this email yet. If you completed checkout in the last minute, wait briefly and try again.",
      },
      { status: 404 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(
    paidCookieName,
    createPaidCookieValue(email),
    paidCookieMetadata(),
  );

  return response;
}
