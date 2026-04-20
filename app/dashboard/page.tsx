import Link from "next/link";
import { cookies } from "next/headers";
import { Lock, Sparkles } from "lucide-react";

import { RepoSelector } from "@/components/dashboard/RepoSelector";
import { CheckoutButton } from "@/components/landing/CheckoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
  description: "Connect GitHub and generate a portfolio-ready showcase from your repositories."
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const paid = cookieStore.get("pts_paid")?.value === "1";
  const username = cookieStore.get("gh_username")?.value;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Builder Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">
            Portfolio Intelligence Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sync repositories, select standout projects, and publish a portfolio link with real
            delivery evidence.
          </p>
        </div>
        {username ? (
          <Link
            href={`/portfolio/${username}`}
            className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/50"
          >
            View public portfolio
          </Link>
        ) : null}
      </div>

      {!paid ? (
        <Card className="border-cyan-400/30 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-200">
              <Lock className="h-5 w-5" />
              Dashboard access is unlocked after checkout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm text-slate-300">
              Your plan includes GitHub repo sync, automated stack analysis, and public portfolio
              publishing. Activate access to start building immediately.
            </p>
            <CheckoutButton className="mt-5" label="Unlock dashboard for $9/month" />
            <p className="mt-3 text-xs text-slate-500">
              After payment, Lemon Squeezy returns you here and your secure access cookie is set
              automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 border-emerald-400/30 bg-slate-900/70">
            <CardContent className="pt-6 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2 text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Access active. Connect GitHub and generate your first polished project narrative.
              </p>
            </CardContent>
          </Card>
          <RepoSelector />
        </>
      )}
    </main>
  );
}
