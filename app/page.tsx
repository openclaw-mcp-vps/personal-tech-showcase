import Link from "next/link";
import { ArrowRight, CheckCircle2, GitCommitHorizontal, ShieldCheck } from "lucide-react";

import { CheckoutButton } from "@/components/landing/CheckoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    q: "How does Personal Tech Showcase stand out from static portfolio templates?",
    a: "Instead of asking you to manually write every project bullet, it analyzes repositories, surfaces delivery signals, and converts your work into case-study style cards with technical depth."
  },
  {
    q: "Can recruiters view my portfolio without logging in?",
    a: "Yes. Each portfolio gets a public route at /portfolio/{username} so hiring managers can review your projects, stack choices, and momentum in one link."
  },
  {
    q: "What happens after I purchase?",
    a: "Checkout unlocks the dashboard through a secure access cookie. You can connect GitHub, sync repositories, and immediately publish project showcases."
  },
  {
    q: "Will this work for freelancers and client proposals?",
    a: "Yes. The generated project story emphasizes outcomes, architecture, and impact metrics so you can communicate technical credibility quickly in proposal workflows."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-cyan-500/20 bg-slate-900/50 px-6 py-12 shadow-[0_30px_120px_-45px_rgba(34,211,238,0.8)] sm:px-10">
        <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Portfolio Tools for Working Developers
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-50 sm:text-6xl">
          Share your personal tech projects beautifully.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Personal Tech Showcase turns your GitHub history into polished project stories with live
          demo links, stack decisions, and delivery metrics so recruiters and clients instantly see
          your engineering depth.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CheckoutButton />
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
          >
            Open dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          $9/month. Cancel anytime. Built for mid-level startup developers and freelancers.
        </p>
      </header>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-200">
              <GitCommitHorizontal className="h-5 w-5" />
              Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Most portfolios are static lists of links. They rarely show technical decisions,
            iteration speed, or real project impact.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Sync repos, auto-detect stacks, highlight commits and deployment URLs, and publish a
            portfolio that tells the story behind each build.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-200">
              <ShieldCheck className="h-5 w-5" />
              Why It Converts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Hiring teams can evaluate capability fast: problem framing, implementation depth, and
            consistent execution signals are presented in one page.
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What You Get in the Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>Automatic repository ingestion with commit velocity and contributor analytics.</li>
              <li>Project cards that surface tech stack, deployment URL, and business impact cues.</li>
              <li>Portfolio publishing at a clean public URL for applications and client outreach.</li>
              <li>Continuous sync so your portfolio evolves as your codebase evolves.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-50">
              $9<span className="text-base text-slate-400">/month</span>
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Purpose-built for developers who need a serious portfolio without spending weekends
              handcrafting pages.
            </p>
            <CheckoutButton className="mt-5" label="Get instant access" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-slate-100">Frequently Asked Questions</h2>
        <div className="mt-5 grid gap-4">
          {faqItems.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300">{item.a}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
