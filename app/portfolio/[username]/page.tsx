import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Clock3, Rocket } from "lucide-react";

import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPublicPortfolioProjects } from "@/lib/github";
import { readPortfolioProjects } from "@/lib/supabase";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username} portfolio`,
    description:
      "Explore a technical portfolio generated from live GitHub repositories, commit activity, and project outcomes.",
    openGraph: {
      title: `${username} | Personal Tech Showcase`,
      description:
        "Production projects, stack decisions, and engineering metrics in one portfolio page.",
      type: "profile"
    }
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;

  const storedProjects = await readPortfolioProjects(username);
  const projects = storedProjects ?? (await fetchPublicPortfolioProjects(username, 8));

  if (projects.length === 0) {
    notFound();
  }

  const totalStars = projects.reduce((sum, project) => sum + project.impact.stars, 0);
  const totalCommits = projects.reduce(
    (sum, project) => sum + project.impact.commitsLast30Days,
    0
  );
  const deployments = projects.filter((project) => Boolean(project.homepageUrl)).length;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Public Showcase</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">@{username}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          A live technical portfolio generated from GitHub activity, curated for recruiters, hiring
          managers, and clients who want clear evidence of execution.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-200">
          Build your own portfolio with Personal Tech Showcase
        </Link>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-cyan-300" />
              Total Stars
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-100">{totalStars}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-emerald-300" />
              Commits (30d)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-100">{totalCommits}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket className="h-4 w-4 text-violet-300" />
              Live Deployments
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-100">{deployments}</CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}
