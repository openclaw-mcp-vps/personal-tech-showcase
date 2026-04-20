import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsDisplay } from "@/components/ui/metrics-display";
import { TechStackBadge } from "@/components/ui/tech-stack-badge";
import type { PortfolioAnalysis, PortfolioProject } from "@/types/portfolio";

interface ShowcasePreviewProps {
  username: string;
  projects: PortfolioProject[];
  analysis: PortfolioAnalysis | null;
}

export function ShowcasePreview({ username, projects, analysis }: ShowcasePreviewProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Showcase Preview</CardTitle>
          <CardDescription>Select repositories to see the generated showcase page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Showcase Preview for @{username}</CardTitle>
        <CardDescription>
          This is how recruiters and clients will experience your technical story once published.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[#2f81f7]/40 bg-[#1f6feb]/10 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#9ecbff]">
              <Trophy className="h-4 w-4" />
              Portfolio Insight Summary
            </div>
            <p className="text-sm text-[var(--foreground)]">
              {analysis.totalProjects} selected projects, {analysis.totalStars} combined stars, and an average of {" "}
              {analysis.averageCommitVelocity} commits per project in the last month.
            </p>
            {analysis.skillSignals.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm text-[var(--muted-foreground)]">
                {analysis.skillSignals.slice(0, 3).map((signal) => (
                  <li key={signal}>• {signal}</li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        ) : null}

        <div className="space-y-5">
          {projects.map((project) => (
            <div key={project.id} className="rounded-lg border border-[var(--border)] bg-[#0f141b] p-4">
              <h3 className="text-base font-semibold">{project.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{project.story}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.slice(0, 6).map((tech) => (
                  <TechStackBadge key={`${project.id}-${tech}`} label={tech} emphasis={tech === project.primaryLanguage} />
                ))}
              </div>
              <div className="mt-3">
                <MetricsDisplay metrics={project.metrics} compact />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
