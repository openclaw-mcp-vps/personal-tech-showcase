"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectShowcase } from "@/components/project-showcase";
import { TechStackAnalyzer } from "@/components/tech-stack-analyzer";
import type { RepoSyncResult } from "@/types/portfolio";

interface PortfolioBuilderProps {
  initialUsername?: string;
}

export function PortfolioBuilder({ initialUsername = "" }: PortfolioBuilderProps) {
  const [username, setUsername] = useState(initialUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<RepoSyncResult | null>(null);

  const stats = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        label: "Projects Profiled",
        value: data.totals.projects,
        helper: "Most recently active repositories",
      },
      {
        label: "Total Stars",
        value: data.totals.stars,
        helper: "Combined social proof across projects",
      },
      {
        label: "Commits in 30 days",
        value: data.totals.commits30d,
        helper: "Recent implementation intensity",
      },
    ];
  }, [data]);

  async function syncRepos() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/repos/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const payload = (await response.json()) as RepoSyncResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Sync failed");
      }

      setData(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not sync repositories",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-wide text-[#8b949e]">
              Portfolio Builder
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#e6edf3]">
              Convert repository activity into recruiter-ready project stories
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#9da7b3]">
              Enter a GitHub username, sync recent repositories, and instantly generate
              technical impact narratives with live demo links, stack breakdowns, and
              commit velocity metrics.
            </p>
          </div>
          <a
            href="/api/auth/github"
            className="text-sm font-medium text-[#58a6ff] underline-offset-4 hover:underline"
          >
            Connect GitHub OAuth for private repositories
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="github-username" className="sr-only">
            GitHub Username
          </label>
          <input
            id="github-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. torvalds"
            className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-[#e6edf3] outline-none transition focus:border-[#58a6ff]"
          />
          <Button
            onClick={syncRepos}
            disabled={isLoading || username.trim().length === 0}
            className="h-11 rounded-lg bg-[#1f6feb] px-5 text-sm font-semibold text-white hover:bg-[#2f81f7]"
          >
            {isLoading ? "Syncing..." : "Sync Repositories"}
          </Button>
        </div>

        {error ? (
          <p className="mt-3 rounded-lg border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-sm text-[#ffb4ad]">
            {error}
          </p>
        ) : null}
      </section>

      {data ? (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#30363d] bg-[#111827] p-4"
              >
                <p className="text-xs uppercase tracking-wide text-[#8b949e]">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-[#e6edf3]">{item.value}</p>
                <p className="mt-1 text-xs text-[#9da7b3]">{item.helper}</p>
              </div>
            ))}
          </div>

          <TechStackAnalyzer
            title={`Top Technology Signals for ${data.username}`}
            stacks={data.topTechnologies}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#30363d] bg-[#111827] p-4">
            <div>
              <p className="text-sm font-medium text-[#e6edf3]">Public Portfolio Link</p>
              <p className="text-xs text-[#9da7b3]">Share this link with recruiters and clients</p>
            </div>
            <a
              href={`/portfolio/${data.username}`}
              className="rounded-lg border border-[#2f81f7]/55 bg-[#1f6feb]/15 px-3 py-2 text-sm font-medium text-[#58a6ff] hover:bg-[#1f6feb]/25"
            >
              /portfolio/{data.username}
            </a>
          </div>

          <div className="space-y-4">
            {data.projects.map((project) => (
              <ProjectShowcase key={project.id} project={project} />
            ))}
          </div>
        </motion.section>
      ) : null}
    </div>
  );
}
