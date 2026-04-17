import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildPortfolioFromGitHubToken } from "@/lib/github-api";
import { getSupabaseClient } from "@/lib/supabase";
import type { PortfolioProfile } from "@/types/portfolio";

const STORE_PATH = path.join(process.cwd(), "data", "portfolios.json");

async function readPortfolioStore(): Promise<Record<string, PortfolioProfile>> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as Record<string, PortfolioProfile>;
  } catch {
    return {};
  }
}

async function writePortfolioStore(data: Record<string, PortfolioProfile>): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("pts_access")?.value === "granted";
  const token = cookieStore.get("gh_token")?.value;

  if (!hasAccess) {
    return NextResponse.json(
      { error: "Access locked. Purchase required." },
      { status: 402 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: "GitHub OAuth token not found." },
      { status: 401 },
    );
  }

  const portfolio = await buildPortfolioFromGitHubToken(token);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("portfolios").upsert(
      {
        github_login: portfolio.githubLogin,
        display_name: portfolio.displayName,
        payload: portfolio,
        synced_at: portfolio.syncedAt,
      },
      { onConflict: "github_login" },
    );
  }

  const store = await readPortfolioStore();
  store[portfolio.githubLogin] = portfolio;
  await writePortfolioStore(store);

  return NextResponse.json({ ok: true, portfolio });
}
