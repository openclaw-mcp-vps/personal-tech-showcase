import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzePortfolio } from "@/lib/project-analyzer";
import type { PortfolioProject } from "@/types/portfolio";

const commitSchema = z.object({
  sha: z.string(),
  message: z.string(),
  authoredAt: z.string(),
  authorName: z.string()
});

const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  fullName: z.string(),
  description: z.string(),
  htmlUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  homepage: z.string().optional(),
  primaryLanguage: z.string(),
  techStack: z.array(z.string()),
  topics: z.array(z.string()),
  stars: z.number(),
  forks: z.number(),
  openIssues: z.number(),
  watchers: z.number(),
  recentCommits: z.array(commitSchema),
  commitVelocity: z.number(),
  readmeSnippet: z.string(),
  lastUpdatedAt: z.string(),
  metrics: z.object({
    commits30d: z.number(),
    stars: z.number(),
    forks: z.number(),
    openIssues: z.number(),
    releaseCadence: z.enum(["high", "medium", "low"])
  }),
  story: z.string()
});

const requestSchema = z.object({
  projects: z.array(projectSchema).min(1, "Select at least one project to analyze.")
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid request body."
      },
      { status: 400 }
    );
  }

  const analysis = analyzePortfolio(parsed.data.projects as PortfolioProject[]);

  return NextResponse.json({ analysis });
}
