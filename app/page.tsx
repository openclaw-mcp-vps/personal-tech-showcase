import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, GitBranch, LayoutTemplate, Sparkles } from "lucide-react";

import { CheckoutOverlayButton } from "@/components/checkout-overlay-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faq = [
  {
    question: "How is this different from a normal portfolio site?",
    answer:
      "Instead of static project blurbs, Personal Tech Showcase reads repository activity, extracts technical signals, and turns each project into a narrative with engineering outcomes and stack credibility."
  },
  {
    question: "Do I need to give full GitHub access?",
    answer:
      "No. Public repositories work immediately. A GitHub token is optional and only used to raise API limits or include private repositories you choose to surface."
  },
  {
    question: "Can I share one public link with recruiters?",
    answer:
      "Yes. Every curated profile gets a public `/showcase/{username}` route that presents selected projects with commit momentum, impact metrics, and live demo links."
  },
  {
    question: "What happens after payment?",
    answer:
      "Checkout runs in a Lemon Squeezy overlay. On successful purchase, dashboard access is granted using a secure cookie so you can immediately start building your portfolio."
  }
];

const painPoints = [
  "Portfolio sites are hand-maintained and stale within weeks.",
  "Most project lists fail to prove engineering depth or delivery consistency.",
  "Recruiters cannot quickly identify impact, ownership, or technical range."
];

const outcomes = [
  {
    icon: GitBranch,
    title: "Automated GitHub Intelligence",
    description:
      "Pull repository metadata, commit history, README context, and tech stack signals without manual data entry."
  },
  {
    icon: LayoutTemplate,
    title: "Narrative Project Cards",
    description:
      "Generate project stories that explain what was built, why it mattered, and which technologies drove the result."
  },
  {
    icon: Gauge,
    title: "Impact Metrics That Matter",
    description:
      "Highlight release cadence, adoption indicators, and maintenance quality to demonstrate real-world delivery."
  }
];

export default function HomePage() {
  return (
    <main className="grid-glow min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[var(--border)] bg-[#0f141b]/90 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1f6feb]/40 bg-[#1f6feb]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#9ecbff]">
            <Sparkles className="h-3.5 w-3.5" />
            Portfolio Tools for Builders Who Ship
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
            Share your personal tech projects beautifully
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg">
            Personal Tech Showcase transforms your GitHub repositories into a polished portfolio with live demos,
            tech-stack context, and measurable impact so recruiters and clients see your actual engineering value fast.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <CheckoutOverlayButton />
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                I already paid
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">$9/month • Cancel anytime • Lemon Squeezy billing</p>
        </header>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--muted-foreground)]">
              {painPoints.map((point) => (
                <p key={point} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#f85149]" />
                  <span>{point}</span>
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">The Outcome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outcomes.map((item) => (
                <div key={item.title} className="rounded-lg border border-[var(--border)] bg-[#0f141b] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#9ecbff]">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-14">
          <Card className="surface overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
              <div className="p-7 sm:p-10">
                <h2 className="text-2xl font-semibold">A portfolio that proves technical depth, not just project titles</h2>
                <p className="mt-3 text-[var(--muted-foreground)]">
                  Build a showcase that communicates architecture choices, execution velocity, and maintenance discipline.
                  Every project card is backed by source-of-truth repository data.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>Auto-detect deployed demos and surface them alongside source code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>Highlight technology breadth with stack badges and domain-specific topics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>Show commit momentum and adoption signals for stronger recruiter trust</span>
                  </li>
                </ul>
              </div>
              <div className="border-t border-[var(--border)] bg-[#0f141b] p-7 lg:border-l lg:border-t-0 sm:p-10">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">One plan. Everything needed to publish quickly.</p>
                <div className="mt-5 rounded-xl border border-[#2f81f7]/50 bg-[#1f6feb]/10 p-5">
                  <p className="text-3xl font-semibold">$9<span className="text-base text-[var(--muted-foreground)]"> / month</span></p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Includes dashboard access, automated GitHub analysis, and a shareable public showcase route.
                  </p>
                  <div className="mt-5">
                    <CheckoutOverlayButton />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {faq.map((entry) => (
              <Card key={entry.question}>
                <CardHeader>
                  <CardTitle className="text-base">{entry.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">{entry.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
