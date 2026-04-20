import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  exchangeGithubCodeForToken,
  fetchGithubUser,
  getGitHubOAuthUrl
} from "@/lib/github";

const STATE_COOKIE = "gh_oauth_state";
const TOKEN_COOKIE = "gh_token";
const USERNAME_COOKIE = "gh_username";

function cookieOptions() {
  return {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const incomingState = url.searchParams.get("state");

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET first."
      },
      { status: 500 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const redirectUri = `${origin}/api/auth/github`;

  if (code) {
    const expectedState = request.cookies.get(STATE_COOKIE)?.value;

    if (!incomingState || !expectedState || incomingState !== expectedState) {
      return NextResponse.redirect(new URL("/dashboard?error=oauth_state", origin));
    }

    try {
      const token = await exchangeGithubCodeForToken(code, redirectUri);
      const user = await fetchGithubUser(token);

      const response = NextResponse.redirect(new URL("/dashboard?connected=1", origin));
      response.cookies.delete(STATE_COOKIE);
      response.cookies.set(TOKEN_COOKIE, token, {
        ...cookieOptions(),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30
      });
      response.cookies.set(USERNAME_COOKIE, user.login, {
        ...cookieOptions(),
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30
      });

      return response;
    } catch (error) {
      console.error("GitHub OAuth callback failed", error);
      return NextResponse.redirect(new URL("/dashboard?error=oauth_failed", origin));
    }
  }

  const state = crypto.randomBytes(24).toString("hex");
  const response = NextResponse.redirect(
    getGitHubOAuthUrl({ clientId, redirectUri, state }).toString()
  );

  response.cookies.set(STATE_COOKIE, state, {
    ...cookieOptions(),
    httpOnly: true,
    maxAge: 60 * 10
  });

  return response;
}
