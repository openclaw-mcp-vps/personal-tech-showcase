import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui/badge";
import { ProjectShowcase } from "@/components/project-showcase";
import { TechStackAnalyzer } from "@/components/tech-stack-analyzer";
import type { PortfolioProfile } from "@/types/portfolio";

async function getPortfolio(username: string): Promise<PortfolioProfile | null> {
  if (username === "demo-engineer") {
    return {
      githubLogin: "demo-engineer",
      displayName: "Demo Engineer",
      headline: "Full-stack engineer shipping resilient products from idea to production",
      summary:
        "I focus on high-leverage backend and product engineering. My work combines shipping speed, clean architecture, and clear operational metrics.",
      avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
      syncedAt: new Date().toISOString(),
      stackSummary: {
        totalRepos: 4,
        totalStars: 182,
        deploymentCoverage: 75,
        primaryLanguages: [
          { name: "TypeScript", value: 2 },
          { name: "Go", value: 1 },
          { name: "Python", value: 1 },
        ],
      },
      projects: [
        {
          id: 1001,
          name: "commerce-control-center",
          fullName: "demo-engineer/commerce-control-center",
          description:
            "Admin platform that unified order orchestration and reduced manual support operations by 34%.",
          homepage: "https://example.com",
          repoUrl: "https://github.com/demo-engineer/commerce-control-center",
          language: "TypeScript",
          topics: ["nextjs", "postgres", "payments"],
          pushedAt: new Date().toISOString(),
          metrics: {
            stars: 61,
            forks: 11,
            openIssues: 4,
            commitsLast30Days: 26,
          },
          commitHistory: [
            { date: "2026-03-30", count: 1 },
            { date: "2026-04-01", count: 2 },
            { date: "2026-04-04", count: 3 },
            { date: "2026-04-08", count: 4 },
            { date: "2026-04-14", count: 2 },
          ],
          snippet: {
            fileName: "app/api/orders/route.ts",
            language: "typescript",
            content:
              "export async function POST(req: Request) {\n  const payload = await req.json();\n  const plan = buildFulfillmentPlan(payload.items);\n  await queue.publish('fulfillment.created', plan);\n  return Response.json({ ok: true, id: plan.id });\n}",
          },
        },
      ],
    };
  }

  const filePath = path.join(process.cwd(), "data", "portfolios.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as Record<string, PortfolioProfile>;
    return payload[username] ?? null;
  } catch {
    return null;
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-20 pt-10 md:px-10">
      <section className="rounded-2xl border border-[#263042] bg-[#161b22] p-6">
        <p className="text-sm text-[#9fb0c3]">Portfolio by @{portfolio.githubLogin}</p>
        <h1 className="mt-2 text-3xl font-bold">{portfolio.displayName}</h1>
        <p className="mt-1 text-lg text-[#c9d1d9]">{portfolio.headline}</p>
        <p className="mt-3 max-w-3xl text-sm text-[#9fb0c3]">{portfolio.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-[#0d1117] text-[#9fb0c3]">
            Synced {new Date(portfolio.syncedAt).toLocaleDateString()}
          </Badge>
          <Badge className="bg-[#0d1117] text-[#2f81f7]">
            {portfolio.stackSummary.totalRepos} featured projects
          </Badge>
        </div>
      </section>

      <section className="mt-8">
        <TechStackAnalyzer summary={portfolio.stackSummary} />
      </section>

      <section className="mt-8 space-y-5">
        {portfolio.projects.map((project) => (
          <ProjectShowcase key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}
