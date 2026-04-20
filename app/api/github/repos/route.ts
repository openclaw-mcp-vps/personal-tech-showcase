import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchUserRepos } from "@/lib/github-api";

const querySchema = z.object({
  username: z.string().min(1, "GitHub username is required."),
  limit: z.coerce.number().int().min(1).max(12).default(8)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    username: searchParams.get("username") ?? "",
    limit: searchParams.get("limit") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid query parameters."
      },
      { status: 400 }
    );
  }

  try {
    const tokenHeader = request.headers.get("authorization") ?? "";
    const token = tokenHeader.startsWith("Bearer ")
      ? tokenHeader.replace("Bearer ", "")
      : request.headers.get("x-github-token") ?? undefined;

    const repos = await fetchUserRepos(parsed.data.username, token, parsed.data.limit);

    return NextResponse.json({ repos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load repositories from GitHub.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
