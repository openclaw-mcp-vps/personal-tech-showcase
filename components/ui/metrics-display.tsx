import { GitBranch, GitCommitHorizontal, GitFork, Star } from "lucide-react";

import type { ImpactMetrics } from "@/types/portfolio";

const cadenceTone: Record<ImpactMetrics["releaseCadence"], string> = {
  high: "text-emerald-300",
  medium: "text-amber-300",
  low: "text-slate-300"
};

interface MetricsDisplayProps {
  metrics: ImpactMetrics;
  compact?: boolean;
}

export function MetricsDisplay({ metrics, compact = false }: MetricsDisplayProps) {
  const wrapperClass = compact
    ? "grid grid-cols-2 gap-2 text-xs"
    : "grid grid-cols-2 gap-3 rounded-lg border border-[var(--border)] bg-[#0f141b] p-3 text-xs sm:grid-cols-4";

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
        <Star className="h-3.5 w-3.5 text-yellow-300" />
        <span>{metrics.stars} stars</span>
      </div>
      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
        <GitFork className="h-3.5 w-3.5 text-cyan-300" />
        <span>{metrics.forks} forks</span>
      </div>
      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
        <GitCommitHorizontal className="h-3.5 w-3.5 text-emerald-300" />
        <span>{metrics.commits30d} commits / 30d</span>
      </div>
      <div className="flex items-center gap-1.5">
        <GitBranch className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
        <span className={cadenceTone[metrics.releaseCadence]}>{metrics.releaseCadence} cadence</span>
      </div>
    </div>
  );
}
