import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { ExternalLink, MonitorPlay, SquareTerminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsDisplay } from "@/components/ui/metrics-display";
import { TechStackBadge } from "@/components/ui/tech-stack-badge";
import type { PortfolioProject } from "@/types/portfolio";

interface RepoCardProps {
  project: PortfolioProject;
  selected: boolean;
  onToggle?: (projectId: number) => void;
}

export function RepoCard({ project, selected, onToggle }: RepoCardProps) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <Card className={selected ? "border-[#2f81f7]/70" : undefined}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={project.htmlUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Code
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 7).map((tech) => (
              <TechStackBadge key={`${project.id}-${tech}`} label={tech} emphasis={tech === project.primaryLanguage} />
            ))}
          </div>

          <MetricsDisplay metrics={project.metrics} />

          <div className="rounded-lg border border-[var(--border)] bg-[#0f141b] p-3 text-sm text-[var(--muted-foreground)]">
            <p className="line-clamp-3">{project.readmeSnippet}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span>Updated {formatDistanceToNow(new Date(project.lastUpdatedAt), { addSuffix: true })}</span>
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#9ecbff] hover:underline">
                <MonitorPlay className="h-3.5 w-3.5" />
                Live demo
              </a>
            ) : (
              <span className="inline-flex items-center gap-1">
                <SquareTerminal className="h-3.5 w-3.5" />
                Code-first project
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {onToggle ? (
            <Button
              className="w-full"
              variant={selected ? "secondary" : "default"}
              onClick={() => onToggle(project.id)}
            >
              {selected ? "Remove from showcase" : "Add to showcase"}
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
