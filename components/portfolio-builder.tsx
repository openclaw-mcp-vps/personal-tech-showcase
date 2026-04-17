"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TechStackAnalyzer } from "@/components/tech-stack-analyzer";
import { ProjectShowcase } from "@/components/project-showcase";
import type { PortfolioProfile, PortfolioSyncResponse } from "@/types/portfolio";

interface PortfolioBuilderProps {
  hasAccess: boolean;
  hasGitHub: boolean;
  checkoutUrl: string;
  initialPortfolio: PortfolioProfile | null;
}

export function PortfolioBuilder({
  hasAccess,
  hasGitHub,
  checkoutUrl,
  initialPortfolio,
}: PortfolioBuilderProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [portfolio, setPortfolio] = useState<PortfolioProfile | null>(initialPortfolio);
  const [headline, setHeadline] = useState(initialPortfolio?.headline ?? "");
  const [summary, setSummary] = useState(initialPortfolio?.summary ?? "");
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const checkoutSuccess = params.get("checkout") === "success";

  useEffect(() => {
    if (checkoutSuccess) {
      document.cookie = "pts_access=granted; path=/; max-age=2592000; samesite=lax";
      router.refresh();
    }
  }, [checkoutSuccess, router]);

  async function unlockAfterPurchase() {
    document.cookie = "pts_access=granted; path=/; max-age=2592000; samesite=lax";
    router.refresh();
  }

  async function syncRepos() {
    setSyncing(true);
    setError("");

    try {
      const response = await fetch("/api/repos/sync", { method: "POST" });
      if (!response.ok) {
        throw new Error("Could not sync repositories.");
      }

      const payload = (await response.json()) as PortfolioSyncResponse;
      setPortfolio(payload.portfolio);
      setHeadline(payload.portfolio.headline);
      setSummary(payload.portfolio.summary);
    } catch (syncError) {
      const message =
        syncError instanceof Error ? syncError.message : "Repository sync failed.";
      setError(message);
    } finally {
      setSyncing(false);
    }
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Card className="border-[#263042] bg-[#161b22] text-[#e6edf3]">
          <CardHeader>
            <CardTitle>Unlock ShowBuild Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#9fb0c3]">
              Pro gives you GitHub auto-sync, project impact metrics, code snippet cards,
              and a public showcase link you can share with recruiters.
            </p>
            <div className="rounded-lg border border-[#263042] bg-[#0d1117] p-3 text-sm">
              Monthly plan: <strong className="text-[#3fb950]">$9/month</strong>
            </div>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="lemonsqueezy-button inline-flex h-10 items-center rounded-md bg-[#2f81f7] px-4 text-sm font-medium text-white hover:bg-[#1f6ed4]"
              >
                Open Checkout Overlay
              </a>
            ) : (
              <p className="text-xs text-[#f0883e]">
                Missing Lemon Squeezy environment variables. Add store/product IDs to enable
                checkout.
              </p>
            )}
            <Button
              variant="outline"
              onClick={unlockAfterPurchase}
              className="border-[#263042] bg-[#0d1117]"
            >
              I completed checkout, unlock dashboard
            </Button>
            {checkoutSuccess ? (
              <p className="text-xs text-[#3fb950]">
                Checkout success detected. Access cookie was set automatically.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasGitHub) {
    return (
      <Card className="mx-auto w-full max-w-3xl border-[#263042] bg-[#161b22] text-[#e6edf3]">
        <CardHeader>
          <CardTitle>Connect GitHub to Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#9fb0c3]">
            Connect GitHub to pull live repository data, commit history, and project metadata.
          </p>
          <a
            className="inline-flex h-10 items-center rounded-md bg-[#238636] px-4 text-sm font-medium text-white hover:bg-[#2ea043]"
            href="/api/auth/github"
          >
            Connect with GitHub OAuth
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-[#263042] bg-[#161b22] text-[#e6edf3]">
        <CardHeader>
          <CardTitle>Portfolio Narrative</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            Headline
            <Input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Technical headline"
              className="border-[#263042] bg-[#0d1117]"
            />
          </label>
          <label className="space-y-2 text-sm sm:col-span-2">
            Problem-solving summary
            <Textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="How you deliver outcomes"
              className="min-h-24 border-[#263042] bg-[#0d1117]"
            />
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button
              onClick={syncRepos}
              disabled={syncing}
              className="bg-[#2f81f7] text-white hover:bg-[#1f6ed4]"
            >
              {syncing ? "Syncing repositories..." : "Sync GitHub repositories"}
            </Button>
            {portfolio?.githubLogin ? (
              <a
                href={`/portfolio/${portfolio.githubLogin}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-md border border-[#263042] bg-[#0d1117] px-4 text-sm"
              >
                Open public portfolio
              </a>
            ) : null}
          </div>
          {error ? <p className="text-sm text-[#f85149] sm:col-span-2">{error}</p> : null}
        </CardContent>
      </Card>

      {portfolio ? (
        <>
          <TechStackAnalyzer summary={portfolio.stackSummary} />
          <div className="space-y-5">
            {portfolio.projects.map((project) => (
              <ProjectShowcase key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <Card className="border-[#263042] bg-[#161b22] text-[#e6edf3]">
          <CardContent className="p-6 text-sm text-[#9fb0c3]">
            Sync your repositories to generate your portfolio story.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
