import Script from "next/script";
import { cookies } from "next/headers";
import { PortfolioBuilder } from "@/components/portfolio-builder";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";
import type { PortfolioProfile } from "@/types/portfolio";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadPortfolio(login: string): Promise<PortfolioProfile | null> {
  const filePath = path.join(process.cwd(), "data", "portfolios.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as Record<string, PortfolioProfile>;
    return payload[login] ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("pts_access")?.value === "granted";
  const githubLogin = cookieStore.get("gh_login")?.value;
  const hasGitHub = Boolean(cookieStore.get("gh_token")?.value);

  const checkoutUrl = getCheckoutUrl();
  const initialPortfolio = githubLogin ? await loadPortfolio(githubLogin) : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-20 pt-10 md:px-10">
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
      <section className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">Portfolio Builder Dashboard</h1>
        <p className="text-[#9fb0c3]">
          Sync your repositories, generate strong project narratives, and publish a portfolio
          link built for technical interviews and client evaluations.
        </p>
      </section>
      <PortfolioBuilder
        hasAccess={hasAccess}
        hasGitHub={hasGitHub}
        checkoutUrl={checkoutUrl}
        initialPortfolio={initialPortfolio}
      />
    </main>
  );
}
