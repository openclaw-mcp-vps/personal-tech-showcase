"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ShowcasePreview } from "@/components/showcase-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RepoCard } from "@/components/ui/repo-card";
import type { PortfolioAnalysis, PortfolioProject } from "@/types/portfolio";

const formSchema = z.object({
  username: z
    .string()
    .min(1, "GitHub username is required.")
    .regex(/^[a-zA-Z0-9-]+$/, "Use only letters, numbers, and hyphens."),
  githubToken: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function PortfolioBuilder() {
  const [repos, setRepos] = useState<PortfolioProject[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      githubToken: ""
    }
  });

  const watchedUsername = form.watch("username");

  const selectedProjects = useMemo(
    () => repos.filter((project) => selectedIds.includes(project.id)),
    [repos, selectedIds]
  );

  const toggleProject = (projectId: number) => {
    setSelectedIds((current) =>
      current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId]
    );
  };

  const loadRepos = form.handleSubmit(async (values) => {
    setError(null);
    setAnalysis(null);
    setLoadingRepos(true);

    try {
      const response = await fetch(`/api/github/repos?username=${encodeURIComponent(values.username)}&limit=9`, {
        headers: values.githubToken
          ? {
              Authorization: `Bearer ${values.githubToken}`
            }
          : undefined
      });

      const payload = (await response.json()) as { repos?: PortfolioProject[]; error?: string };

      if (!response.ok || !payload.repos) {
        throw new Error(payload.error ?? "Unable to load repositories for this user.");
      }

      setRepos(payload.repos);
      setSelectedIds(payload.repos.slice(0, 3).map((repo) => repo.id));
    } catch (requestError) {
      setRepos([]);
      setSelectedIds([]);
      setError(requestError instanceof Error ? requestError.message : "Unexpected GitHub API error.");
    } finally {
      setLoadingRepos(false);
    }
  });

  const runAnalysis = async () => {
    if (selectedProjects.length === 0) {
      setError("Select at least one project before running analysis.");
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      const response = await fetch("/api/github/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projects: selectedProjects })
      });

      const payload = (await response.json()) as { analysis?: PortfolioAnalysis; error?: string };

      if (!response.ok || !payload.analysis) {
        throw new Error(payload.error ?? "Project analysis failed.");
      }

      setAnalysis(payload.analysis);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected analyzer error.");
      setAnalysis(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
      >
        <Card className="surface">
          <CardHeader>
            <CardTitle>Import and Curate Projects</CardTitle>
            <CardDescription>
              Pull your repositories, choose the strongest work, and generate narrative-rich project cards with proof of
              execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={loadRepos}>
              <div className="space-y-2">
                <Label htmlFor="username">GitHub Username</Label>
                <Input id="username" placeholder="octocat" {...form.register("username")} />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Public repositories are supported without auth. Add a token to avoid API rate limits.
                </p>
                {form.formState.errors.username ? (
                  <p className="text-xs text-red-300">{form.formState.errors.username.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubToken">GitHub Token (Optional)</Label>
                <Input id="githubToken" type="password" placeholder="ghp_..." {...form.register("githubToken")} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={loadingRepos}>
                  {loadingRepos ? "Fetching repositories..." : "Fetch repositories"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={selectedIds.length === 0 || analyzing}
                  onClick={runAnalysis}
                >
                  {analyzing ? "Analyzing projects..." : "Generate analysis"}
                </Button>
              </div>

              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              {repos.length > 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Loaded {repos.length} repositories. {selectedIds.length} currently selected for your showcase.
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <ShowcasePreview username={watchedUsername || "your-profile"} projects={selectedProjects} analysis={analysis} />
      </motion.div>

      {repos.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Project Candidates</h2>
            <Link
              className="text-sm font-medium text-[#9ecbff] hover:underline"
              href={`/showcase/${encodeURIComponent(watchedUsername || "")}`}
            >
              Open public showcase page
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {repos.map((repo) => (
              <RepoCard key={repo.id} project={repo} selected={selectedIds.includes(repo.id)} onToggle={toggleProject} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
