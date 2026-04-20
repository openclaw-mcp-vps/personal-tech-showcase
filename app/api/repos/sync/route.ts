import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { fetchPortfolioProjectsForViewer } from "@/lib/github";
import { savePortfolioProjects } from "@/lib/supabase";

const requestSchema = z
  .object({
    limit: z.coerce.number().min(1).max(12).default(12)
  })
  .partial();

const PAYWALL_COOKIE = "pts_paid";
const GITHUB_TOKEN_COOKIE = "gh_token";

export async function POST(request: NextRequest) {
  const hasAccess = request.cookies.get(PAYWALL_COOKIE)?.value === "1";
  if (!hasAccess) {
    return NextResponse.json({ error: "Paid access required." }, { status: 402 });
  }

  const githubToken = request.cookies.get(GITHUB_TOKEN_COOKIE)?.value;
  if (!githubToken) {
    return NextResponse.json(
      {
        error: "GitHub account not connected.",
        authUrl: "/api/auth/github"
      },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sync payload." }, { status: 400 });
  }

  try {
    const result = await fetchPortfolioProjectsForViewer(githubToken, parsed.data.limit ?? 12);

    await savePortfolioProjects(result.username, result.projects);

    return NextResponse.json({
      username: result.username,
      syncedAt: new Date().toISOString(),
      projects: result.projects
    });
  } catch (error) {
    console.error("Failed to sync repositories", error);
    return NextResponse.json(
      {
        error: "Could not sync repositories. Reconnect GitHub and try again."
      },
      { status: 500 }
    );
  }
}
