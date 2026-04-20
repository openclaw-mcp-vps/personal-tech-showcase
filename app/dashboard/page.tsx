import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PortfolioBuilder } from "@/components/portfolio-builder";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Build your technical showcase from GitHub repositories and publish a recruiter-ready portfolio."
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("pts_access")?.value === "granted";

  if (!hasAccess) {
    redirect("/?paywall=1");
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[#0f141b]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">Portfolio Builder Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)] sm:text-base">
            Import repositories, curate featured projects, and generate a high-signal technical narrative for job
            applications, client pitches, or personal branding.
          </p>
        </div>
      </div>

      <PortfolioBuilder />
    </main>
  );
}
