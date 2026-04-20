"use client";

import { useMemo, useState } from "react";
import { Activity, ExternalLink, FolderGit2, Loader2, RefreshCcw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type RepoSyncResponse } from "@/types/portfolio";

export function RepoSelector() {
  const [data, setData] = useState<RepoSyncResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);

  const syncRepos = async () => {
    setIsLoading(true);
    setError(null);
    setAuthUrl(null);

    try {
      const response = await fetch("/api/repos/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ limit: 12 })
      });

      const payload = (await response.json()) as
        | RepoSyncResponse
        | { error?: string; authUrl?: string };

      if (!response.ok) {
        if (response.status === 401 && "authUrl" in payload && payload.authUrl) {
          setAuthUrl(payload.authUrl);
          setError("Connect GitHub before syncing repositories.");
          return;
        }

        throw new Error(("error" in payload && payload.error) || "Repo sync failed.");
      }

      const syncData = payload as RepoSyncResponse;
      setData(syncData);
      setSelectedRepoIds(syncData.projects.slice(0, 3).map((project) => project.id));
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Unable to sync repositories.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = useMemo(
    () =>
      (data?.projects ?? []).slice(0, 8).map((project) => ({
        name: project.name,
        commits: project.impact.commitsLast30Days,
        stars: project.impact.stars
      })),
    [data]
  );

  const featuredProjects = useMemo(
    () =>
      (data?.projects ?? []).filter((project) =>
        selectedRepoIds.length > 0 ? selectedRepoIds.includes(project.id) : true
      ),
    [data, selectedRepoIds]
  );

  const toggleRepo = (repoId: number) => {
    setSelectedRepoIds((previous) =>
      previous.includes(repoId)
        ? previous.filter((id) => id !== repoId)
        : [...previous, repoId].slice(-6)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-300" />
            Repository Sync
          </CardTitle>
          <CardDescription>
            Pull your latest repositories, detect stack composition, and compute momentum metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={syncRepos} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing repositories...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Sync from GitHub
                </>
              )}
            </Button>
            {authUrl ? (
              <a
                href={authUrl}
                className="inline-flex items-center rounded-lg border border-cyan-500/40 px-3 py-2 text-sm font-medium text-cyan-300"
              >
                Connect GitHub OAuth
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            ) : null}
          </div>
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        </CardContent>
      </Card>

      {data ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-300" />
                Engineering Activity Snapshot
              </CardTitle>
              <CardDescription>
                Commit velocity and star signals for your most recently updated repositories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: 12
                      }}
                    />
                    <Bar dataKey="commits" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="stars" fill="#34d399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Projects to Feature</CardTitle>
              <CardDescription>
                Pick up to 6 projects. Your public profile route is `/portfolio/{data.username}`.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.projects.map((project) => {
                  const checked = selectedRepoIds.includes(project.id);
                  return (
                    <label
                      key={project.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm"
                    >
                      <span className="truncate pr-4">{project.name}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRepo(project.id)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-400"
                      />
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {featuredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
