import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortfolioByUsername } from "@/lib/github";
import { readPortfolioSnapshot } from "@/lib/supabase";
import { ProjectShowcase } from "@/components/project-showcase";
import { TechStackAnalyzer } from "@/components/tech-stack-analyzer";
import type { RepoSyncResult } from "@/types/portfolio";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params;
  const normalized = decodeURIComponent(username);
  const title = `${normalized} | Project Portfolio`;
  const description = `Explore ${normalized}'s technical portfolio with project demos, stack analysis, and delivery metrics.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://personal-tech-showcase.vercel.app/portfolio/${normalized}`,
    },
  };
}

async function resolvePortfolio(username: string): Promise<RepoSyncResult | null> {
  const normalized = decodeURIComponent(username).trim();

  if (!normalized) {
    return null;
  }

  const snapshot = await readPortfolioSnapshot(normalized);

  if (snapshot) {
    return snapshot;
  }

  return fetchPortfolioByUsername(normalized).catch(() => null);
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const portfolio = await resolvePortfolio(username);

  if (!portfolio) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-14 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-8 text-center">
          <h1 className="text-3xl font-semibold text-[#e6edf3]">Portfolio not found</h1>
          <p className="mt-3 text-sm text-[#9da7b3]">
            Ask this developer to sync their repositories from the dashboard first.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3]"
          >
            Back to Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Public Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#e6edf3]">{portfolio.username}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9da7b3]">
          A data-driven project portfolio generated from live GitHub activity. Each card
          highlights architecture, delivery consistency, and measurable impact.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9]">
            Projects: {portfolio.totals.projects}
          </div>
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9]">
            Stars: {portfolio.totals.stars}
          </div>
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9]">
            Commits (30d): {portfolio.totals.commits30d}
          </div>
        </div>
      </section>

      <TechStackAnalyzer title="Portfolio Technology Mix" stacks={portfolio.topTechnologies} />

      <section className="space-y-4">
        {portfolio.projects.map((project) => (
          <ProjectShowcase key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}
