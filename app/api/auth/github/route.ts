import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const STATE_COOKIE = "gh_oauth_state";
const TOKEN_COOKIE = "gh_access_token";
const USER_COOKIE = "gh_username";

function buildRedirectUri(request: NextRequest) {
  return new URL("/api/auth/github", request.url).toString();
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId) {
    return NextResponse.json(
      {
        error: "Missing GITHUB_CLIENT_ID",
      },
      { status: 500 },
    );
  }

  if (!code) {
    const oauthState = randomUUID();
    const redirectUri = buildRedirectUri(request);

    const authorizeUrl = new URL(GITHUB_OAUTH_URL);
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", "read:user repo");
    authorizeUrl.searchParams.set("state", oauthState);

    const response = NextResponse.redirect(authorizeUrl);

    response.cookies.set(STATE_COOKIE, oauthState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  }

  if (!clientSecret) {
    return NextResponse.json(
      {
        error: "Missing GITHUB_CLIENT_SECRET",
      },
      { status: 500 },
    );
  }

  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json(
      {
        error: "Invalid OAuth state",
      },
      { status: 400 },
    );
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: buildRedirectUri(request),
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        error: "GitHub token exchange failed",
      },
      { status: 502 },
    );
  }

  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!tokenPayload.access_token) {
    return NextResponse.json(
      {
        error:
          tokenPayload.error_description || "GitHub did not return an access token",
      },
      { status: 400 },
    );
  }

  let login = "";

  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (userResponse.ok) {
      const userPayload = (await userResponse.json()) as { login?: string };
      login = userPayload.login ?? "";
    }
  } catch {
    // Keep login empty if GitHub user lookup fails.
  }

  const redirectUrl = new URL("/dashboard", request.url);
  redirectUrl.searchParams.set("github", "connected");

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(TOKEN_COOKIE, tokenPayload.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  if (login) {
    response.cookies.set(USER_COOKIE, login, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  response.cookies.delete(STATE_COOKIE);

  return response;
}
