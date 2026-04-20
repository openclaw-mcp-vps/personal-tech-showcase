import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import { RepoCard } from "@/components/ui/repo-card";
import { TechStackBadge } from "@/components/ui/tech-stack-badge";
import { fetchUserRepos } from "@/lib/github-api";
import { analyzePortfolio } from "@/lib/project-analyzer";

interface ShowcasePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username} Showcase`,
    description: `Explore ${username}'s technical projects with commit momentum, stack breakdowns, and measurable delivery signals.`
  };
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { username } = await params;

  const projects = await fetchUserRepos(username, undefined, 6).catch(() => []);
  const analysis = analyzePortfolio(projects);

  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      <section className="border-b border-[var(--border)] bg-[#0f141b]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">@{username}</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)] sm:text-base">
                Technical showcase generated from live repository data. Built to communicate engineering quality, depth,
                and delivery consistency.
              </p>
            </div>
            <Link
              href={`https://github.com/${encodeURIComponent(username)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Github className="h-4 w-4" />
              View GitHub profile
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="mt-6 grid gap-3 rounded-xl border border-[var(--border)] bg-[#111822] p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Projects</p>
                <p className="mt-1 text-2xl font-semibold">{analysis.totalProjects}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Total Stars</p>
                <p className="mt-1 text-2xl font-semibold">{analysis.totalStars}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Avg Commit Velocity</p>
                <p className="mt-1 text-2xl font-semibold">{analysis.averageCommitVelocity}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Top Stack</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {analysis.dominantStack.slice(0, 3).map((tech) => (
                    <TechStackBadge key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl space-y-5 px-4 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold">No public repositories found</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              This profile currently has no public repositories available for automated showcase generation.
            </p>
          </div>
        ) : (
          <>
            {analysis.strongestProject ? (
              <div className="rounded-xl border border-[#2f81f7]/50 bg-[#1f6feb]/10 p-5">
                <p className="text-xs uppercase tracking-wider text-[#9ecbff]">Highest-Signal Project</p>
                <h2 className="mt-1 text-xl font-semibold">{analysis.strongestProject.name}</h2>
                <p className="mt-2 text-sm text-[var(--foreground)]">{analysis.strongestProject.story}</p>
                <a
                  className="mt-3 inline-flex items-center gap-1 text-sm text-[#9ecbff] hover:underline"
                  href={analysis.strongestProject.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore repository
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <RepoCard key={project.id} project={project} selected />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
