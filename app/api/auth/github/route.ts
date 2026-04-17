import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createGitHubOAuthUrl, exchangeGitHubCodeForToken } from "@/lib/github-api";

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = url.origin;
  const cookieStore = await cookies();

  if (!code) {
    const oauthState = crypto.randomBytes(16).toString("hex");
    cookieStore.set("gh_oauth_state", oauthState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return NextResponse.redirect(createGitHubOAuthUrl(origin, oauthState));
  }

  const expectedState = cookieStore.get("gh_oauth_state")?.value;
  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  const token = await exchangeGitHubCodeForToken(code, origin);
  const octokit = new Octokit({ auth: token });
  const user = await octokit.users.getAuthenticated();

  const response = NextResponse.redirect(new URL("/dashboard?github=connected", url));
  response.cookies.set("gh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("gh_login", user.data.login, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
