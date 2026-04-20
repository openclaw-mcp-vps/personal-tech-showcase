import { cn } from "@/lib/utils";

interface TechStackBadgeProps {
  label: string;
  className?: string;
}

export function TechStackBadge({ label, className }: TechStackBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200",
        className
      )}
    >
      {label}
    </span>
  );
}
