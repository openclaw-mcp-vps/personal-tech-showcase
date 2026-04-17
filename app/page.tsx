import Link from "next/link";
import { Check, Sparkles, LineChart, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const faqItems = [
  {
    q: "How is this better than a static portfolio site?",
    a: "ShowBuild reads live repository activity and exposes your technical depth with commit trends, deployment coverage, and implementation snippets, so reviewers can evaluate how you work instead of skimming screenshots.",
  },
  {
    q: "Do I need to write custom markdown for each project?",
    a: "No. Your initial showcase is generated from repository metadata, commit history, and code files. You can then refine your narrative headline and summary inside the dashboard.",
  },
  {
    q: "Who is this built for?",
    a: "Mid-level startup engineers and freelancers who need a polished technical presence for interviews, client pitches, and personal branding.",
  },
  {
    q: "How long does setup take?",
    a: "Most users connect GitHub and publish their first portfolio in under ten minutes.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-20 pt-10 md:px-10">
      <header className="flex items-center justify-between rounded-2xl border border-[#263042] bg-[#161b22]/70 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-[#2f81f7]" />
          ShowBuild
        </div>
        <Link
          href="/dashboard"
          className="rounded-md bg-[#2f81f7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f6ed4]"
        >
          Open Dashboard
        </Link>
      </header>

      <section className="mt-16 grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#263042] bg-[#161b22] px-3 py-1 text-xs text-[#9fb0c3]">
            Portfolio Tools for Developers
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Share your personal tech projects beautifully
          </h1>
          <p className="text-lg text-[#9fb0c3]">
            ShowBuild transforms your GitHub repos into a recruiter-ready showcase with
            live demos, commit momentum, stack insights, and project impact metrics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-[#3fb950] px-5 py-3 text-sm font-semibold text-[#0d1117] hover:bg-[#56d364]"
            >
              Start Building for $9/mo
            </Link>
            <Link
              href="/portfolio/demo-engineer"
              className="rounded-md border border-[#263042] bg-[#161b22] px-5 py-3 text-sm hover:border-[#2f81f7]"
            >
              View Live Portfolio Example
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#263042] bg-[#161b22] p-6">
          <h2 className="text-xl font-semibold">What recruiters actually see</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#9fb0c3]">
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 text-[#3fb950]" />
              Latest commit velocity and shipping consistency
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 text-[#3fb950]" />
              Live deployment links and technology decisions
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 text-[#3fb950]" />
              Code snippets showing implementation depth
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 text-[#3fb950]" />
              Project-by-project impact metrics
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-20 grid gap-4 md:grid-cols-3">
        <Card className="border-[#263042] bg-[#161b22]">
          <CardContent className="space-y-3 p-6">
            <LineChart className="h-5 w-5 text-[#2f81f7]" />
            <h3 className="text-lg font-semibold">Problem</h3>
            <p className="text-sm text-[#9fb0c3]">
              Most developer portfolios are static lists of links. They hide technical depth
              and don&apos;t show how you solve real problems over time.
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#263042] bg-[#161b22]">
          <CardContent className="space-y-3 p-6">
            <Sparkles className="h-5 w-5 text-[#3fb950]" />
            <h3 className="text-lg font-semibold">Solution</h3>
            <p className="text-sm text-[#9fb0c3]">
              ShowBuild automatically converts repository activity into polished project
              showcases with deployment proof, snippets, and stack analysis.
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#263042] bg-[#161b22]">
          <CardContent className="space-y-3 p-6">
            <ShieldCheck className="h-5 w-5 text-[#f0883e]" />
            <h3 className="text-lg font-semibold">Outcome</h3>
            <p className="text-sm text-[#9fb0c3]">
              You present your skills in a way that helps hiring teams and clients quickly
              trust your technical execution.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-20 rounded-2xl border border-[#263042] bg-[#161b22] p-8">
        <h2 className="text-3xl font-bold">Simple pricing for working developers</h2>
        <p className="mt-3 max-w-2xl text-[#9fb0c3]">
          Built for startup engineers and freelancers who need to move fast. Connect GitHub,
          sync projects, and publish a portfolio link that communicates real technical value.
        </p>
        <div className="mt-8 max-w-md rounded-xl border border-[#2f81f7] bg-[#0d1117] p-6">
          <p className="text-sm text-[#9fb0c3]">ShowBuild Pro</p>
          <p className="mt-2 text-4xl font-bold">
            $9<span className="text-base font-medium text-[#9fb0c3]">/month</span>
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[#c9d1d9]">
            <li>GitHub OAuth + repository sync</li>
            <li>Auto-generated project narratives</li>
            <li>Commit history and stack charts</li>
            <li>Public portfolio page</li>
          </ul>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-md bg-[#2f81f7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f6ed4]"
          >
            Start Pro Plan
          </Link>
        </div>
      </section>

      <section className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <Accordion className="mt-4 w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-[#263042]">
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent className="text-[#9fb0c3]">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
