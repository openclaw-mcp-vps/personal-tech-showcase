import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TechStackBadgeProps {
  label: string;
  emphasis?: boolean;
  className?: string;
}

export function TechStackBadge({ label, emphasis = false, className }: TechStackBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        emphasis
          ? "border-[#2f81f7]/60 bg-[#1f6feb]/15 text-[#9ecbff]"
          : "border-[var(--border)] bg-[#151b23] text-[var(--muted-foreground)]",
        className
      )}
    >
      {label}
    </motion.span>
  );
}
