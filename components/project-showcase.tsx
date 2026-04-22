"use client";

import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import type { PortfolioProject } from "@/types/portfolio";

interface ProjectShowcaseProps {
  project: PortfolioProject;
}

function highlight(snippet: string, language: string) {
  const grammar = Prism.languages[language] || Prism.languages.javascript;

  return Prism.highlight(snippet, grammar, language);
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-[#30363d] bg-[#111827] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.3)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#e6edf3]">{project.name}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[#9da7b3]">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-[#2f81f7]/45 bg-[#1f6feb]/15 px-2.5 py-1 text-xs font-medium text-[#58a6ff]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-[#8b949e]">Impact Score</p>
          <p className="text-2xl font-bold text-[#58a6ff]">{project.impactScore}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
            <p className="text-xs uppercase tracking-wide text-[#8b949e]">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-[#e6edf3]">{metric.value}</p>
            <p className="mt-1 text-xs text-[#9da7b3]">{metric.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8b949e]">Code Snapshot</p>
          <p className="mt-1 text-xs text-[#9da7b3]">Language: {project.codeLanguage}</p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-[#30363d] bg-[#010409] p-3 text-[0.75rem] leading-relaxed text-[#c9d1d9]">
            <code
              className={`language-${project.codeLanguage}`}
              dangerouslySetInnerHTML={{
                __html: highlight(project.codeSnippet, project.codeLanguage),
              }}
            />
          </pre>
        </section>

        <section className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <p className="text-xs uppercase tracking-wide text-[#8b949e]">Recent Commits</p>
          <ul className="mt-3 space-y-2">
            {project.recentCommits.map((commit) => (
              <li key={commit.sha} className="rounded-lg border border-[#30363d] p-2.5">
                <p className="text-sm font-medium text-[#e6edf3]">{commit.message}</p>
                <p className="mt-1 text-xs text-[#9da7b3]">
                  {formatDistanceToNow(new Date(commit.committedAt), { addSuffix: true })}
                  {" · "}
                  {format(new Date(commit.committedAt), "MMM d, yyyy")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[#2f81f7]/50 bg-[#1f6feb]/15 px-3.5 py-2 font-medium text-[#58a6ff] transition hover:bg-[#1f6feb]/25"
        >
          View Repository
        </a>
        {project.homepageUrl ? (
          <a
            href={project.homepageUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#30363d] bg-[#111827] px-3.5 py-2 font-medium text-[#e6edf3] transition hover:border-[#58a6ff]/60"
          >
            Open Live Demo
          </a>
        ) : null}
        <span className="rounded-lg border border-[#30363d] bg-[#111827] px-3.5 py-2 text-[#9da7b3]">
          Last push: {format(new Date(project.pushedAt), "MMM d, yyyy")}
        </span>
      </div>
    </motion.article>
  );
}
