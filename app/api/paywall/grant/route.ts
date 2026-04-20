import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  eventName: z.string().min(1),
  orderId: z.union([z.string(), z.number()]).optional(),
  customerEmail: z.string().email().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Malformed purchase confirmation payload." }, { status: 400 });
  }

  if (!parsed.data.eventName.toLowerCase().includes("success")) {
    return NextResponse.json({ error: "Unsupported event." }, { status: 400 });
  }

  const response = NextResponse.json({ access: "granted" });
  response.cookies.set({
    name: "pts_access",
    value: "granted",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  if (parsed.data.customerEmail) {
    response.cookies.set({
      name: "pts_customer",
      value: encodeURIComponent(parsed.data.customerEmail),
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
  }

  return response;
}
