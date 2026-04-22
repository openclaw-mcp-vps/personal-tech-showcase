"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectTechStackItem } from "@/types/portfolio";

interface TechStackAnalyzerProps {
  title: string;
  stacks: ProjectTechStackItem[];
}

export function TechStackAnalyzer({ title, stacks }: TechStackAnalyzerProps) {
  const chartData = stacks.slice(0, 6).map((item) => ({
    language: item.name,
    percentage: item.percentage,
  }));

  return (
    <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8b949e]">
        {title}
      </h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="language"
              tick={{ fill: "#9da7b3", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#9da7b3", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "rgba(56, 139, 253, 0.14)" }}
              contentStyle={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                color: "#e6edf3",
                borderRadius: "10px",
              }}
            />
            <Bar
              dataKey="percentage"
              radius={[8, 8, 0, 0]}
              fill="url(#techGradient)"
              maxBarSize={42}
            />
            <defs>
              <linearGradient id="techGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2f81f7" />
                <stop offset="100%" stopColor="#1f6feb" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
