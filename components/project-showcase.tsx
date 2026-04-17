"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitFork, Star, AlertCircle, Globe } from "lucide-react";
import type { ProjectShowcase as ProjectShowcaseType } from "@/types/portfolio";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ProjectShowcaseProps {
  project: ProjectShowcaseType;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="border-[#263042] bg-[#161b22] text-[#e6edf3]">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <p className="mt-2 text-sm text-[#9fb0c3]">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#263042] bg-[#0d1117] px-3 py-2 text-xs hover:border-[#2f81f7]"
              >
                Open Repository
              </a>
              {project.homepage ? (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-[#263042] bg-[#0d1117] px-3 py-2 text-xs hover:border-[#3fb950]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Live Demo
                </a>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-[#0d1117] text-[#2f81f7]">
              {project.language}
            </Badge>
            {project.topics.slice(0, 5).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="bg-[#0d1117] text-[#9fb0c3]"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-[#263042] bg-[#0d1117] p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
                <Star className="h-4 w-4" /> Stars
              </div>
              <p className="text-xl font-semibold">{project.metrics.stars}</p>
            </div>
            <div className="rounded-md border border-[#263042] bg-[#0d1117] p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
                <GitFork className="h-4 w-4" /> Forks
              </div>
              <p className="text-xl font-semibold">{project.metrics.forks}</p>
            </div>
            <div className="rounded-md border border-[#263042] bg-[#0d1117] p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 text-[#9fb0c3]">
                <AlertCircle className="h-4 w-4" /> Open Issues
              </div>
              <p className="text-xl font-semibold">{project.metrics.openIssues}</p>
            </div>
          </div>

          <div className="h-44 rounded-md border border-[#263042] bg-[#0d1117] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={project.commitHistory}>
                <CartesianGrid stroke="#263042" strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis allowDecimals={false} stroke="#9fb0c3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #263042",
                    borderRadius: 10,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3fb950"
                  fill="#3fb95033"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-hidden rounded-md border border-[#263042]">
            <div className="border-b border-[#263042] bg-[#0d1117] px-3 py-2 text-xs text-[#9fb0c3]">
              {project.snippet.fileName}
            </div>
            <SyntaxHighlighter
              language={project.snippet.language}
              style={atomDark}
              customStyle={{ margin: 0, padding: 14, background: "#0d1117" }}
            >
              {project.snippet.content}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
