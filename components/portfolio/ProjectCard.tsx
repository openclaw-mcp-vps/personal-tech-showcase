"use client";

import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { ExternalLink, GitFork, GitPullRequest, Star } from "lucide-react";

import { TechStackBadge } from "@/components/portfolio/TechStackBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PortfolioProject } from "@/types/portfolio";

interface ProjectCardProps {
  project: PortfolioProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const lastCommit = project.impact.latestCommitAt
    ? formatDistanceToNowStrict(new Date(project.impact.latestCommitAt), { addSuffix: true })
    : "No recent commits";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">
              <a
                href={project.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-cyan-300"
              >
                {project.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardTitle>
            <div className="text-xs text-slate-400">{project.impact.velocityLabel}</div>
          </div>
          <p className="text-sm text-slate-300">{project.description}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-400">{project.snippet}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 6).map((item) => (
              <TechStackBadge key={`${project.id}-${item}`} label={item} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <p className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-300" />
              {project.impact.stars} stars
            </p>
            <p className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5 text-cyan-300" />
              {project.impact.forks} forks
            </p>
            <p className="flex items-center gap-1">
              <GitPullRequest className="h-3.5 w-3.5 text-emerald-300" />
              {project.impact.commitsLast30Days} commits / 30d
            </p>
            <p>{lastCommit}</p>
          </div>
          {project.homepageUrl ? (
            <a
              href={project.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center text-sm font-medium text-cyan-300 hover:text-cyan-200"
            >
              View live demo
              <ExternalLink className="ml-1.5 h-4 w-4" />
            </a>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
