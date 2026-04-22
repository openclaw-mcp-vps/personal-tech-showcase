import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPaidCookie, paidCookieName } from "@/lib/access";
import { fetchPortfolioProjects } from "@/lib/github";
import { upsertPortfolioSnapshot } from "@/lib/supabase";

const SyncRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "GitHub username is required")
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, "Invalid GitHub username"),
});

export async function POST(request: NextRequest) {
  const paidCookie = request.cookies.get(paidCookieName)?.value;
  const paidSession = verifyPaidCookie(paidCookie);

  if (!paidSession.valid) {
    return NextResponse.json(
      {
        error: "Paid access required. Complete checkout to unlock portfolio sync.",
      },
      { status: 402 },
    );
  }

  const payload = await request
    .json()
    .catch(() => ({ username: request.cookies.get("gh_username")?.value ?? "" }));

  const parsed = SyncRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 },
    );
  }

  const token = request.cookies.get("gh_access_token")?.value;

  try {
    const result = await fetchPortfolioProjects({
      username: parsed.data.username,
      token,
    });

    await upsertPortfolioSnapshot(parsed.data.username, result).catch(() => {
      // Snapshot persistence is optional; return sync data anyway.
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not sync repositories from GitHub";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}
