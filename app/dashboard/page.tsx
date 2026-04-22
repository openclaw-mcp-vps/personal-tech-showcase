import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { PortfolioBuilder } from "@/components/portfolio-builder";
import { verifyPaidCookie, paidCookieName } from "@/lib/access";

export const metadata: Metadata = {
  title: "Dashboard | Personal Tech Showcase",
  description:
    "Sync repositories, analyze technical impact, and publish a portfolio that highlights engineering decisions.",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const paidCookie = cookieStore.get(paidCookieName)?.value;
  const paidSession = verifyPaidCookie(paidCookie);
  const githubUsername = cookieStore.get("gh_username")?.value ?? "";
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  if (!paidSession.valid) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-14 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Paid Access Required</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#e6edf3]">
            Unlock your portfolio workspace
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#9da7b3]">
            The builder is available to active subscribers. Complete checkout and then
            claim access with the same purchase email.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={paymentLink}
              className="rounded-lg border border-[#2f81f7] bg-[#1f6feb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f81f7]"
            >
              Start Subscription - $9/mo
            </a>
            <Link
              href="/unlock"
              className="rounded-lg border border-[#30363d] bg-[#0d1117] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition hover:border-[#58a6ff]"
            >
              I already purchased
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-6 lg:px-8">
      <PortfolioBuilder initialUsername={githubUsername} />
    </main>
  );
}
