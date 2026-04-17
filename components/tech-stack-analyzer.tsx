"use client";

import { BarChart3, Rocket, Star, Layers } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechStackSummary } from "@/types/portfolio";

interface TechStackAnalyzerProps {
  summary: TechStackSummary;
}

export function TechStackAnalyzer({ summary }: TechStackAnalyzerProps) {
  return (
    <Card className="border-[#263042] bg-[#161b22] text-[#e6edf3]">
      <CardHeader>
        <CardTitle className="text-lg">Tech Stack Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#263042] bg-[#0d1117] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
              <Layers className="h-4 w-4" />
              Repositories
            </div>
            <p className="text-2xl font-semibold">{summary.totalRepos}</p>
          </div>
          <div className="rounded-lg border border-[#263042] bg-[#0d1117] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
              <Star className="h-4 w-4" />
              Total Stars
            </div>
            <p className="text-2xl font-semibold">{summary.totalStars}</p>
          </div>
          <div className="rounded-lg border border-[#263042] bg-[#0d1117] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
              <Rocket className="h-4 w-4" />
              Deployment Coverage
            </div>
            <p className="text-2xl font-semibold">{summary.deploymentCoverage}%</p>
          </div>
          <div className="rounded-lg border border-[#263042] bg-[#0d1117] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
              <BarChart3 className="h-4 w-4" />
              Distinct Languages
            </div>
            <p className="text-2xl font-semibold">
              {summary.primaryLanguages.length}
            </p>
          </div>
        </div>

        <div className="h-64 w-full rounded-lg border border-[#263042] bg-[#0d1117] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.primaryLanguages} margin={{ top: 10, right: 10 }}>
              <CartesianGrid stroke="#263042" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#9fb0c3" />
              <YAxis stroke="#9fb0c3" allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "#1f2937" }}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #263042",
                  borderRadius: 10,
                }}
              />
              <Bar dataKey="value" fill="#2f81f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
