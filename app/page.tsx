import Link from "next/link";

const faqs = [
  {
    question: "How does the portfolio builder know what to highlight?",
    answer:
      "It analyzes repository languages, recent commit frequency, stars, forks, open issues, and README context to generate project narratives that emphasize technical decision-making.",
  },
  {
    question: "Can I showcase deployed demos and not just source code?",
    answer:
      "Yes. If a repository has a homepage URL or deployment link, the project card surfaces it as a live demo button so reviewers can validate production quality quickly.",
  },
  {
    question: "What happens after I subscribe?",
    answer:
      "Stripe handles checkout. After payment, you confirm your purchase email once and the app stores a secure cookie so your dashboard remains unlocked for ongoing updates.",
  },
  {
    question: "Is this useful only for job seekers?",
    answer:
      "No. Freelancers use it to send project proof in proposals, and startup developers use it to build personal branding pages that communicate technical depth.",
  },
];

const conversionStats = [
  {
    label: "Time saved",
    value: "4-6 hrs/week",
    description: "No more manual portfolio editing after every sprint.",
  },
  {
    label: "Signal clarity",
    value: "3x better",
    description: "Recruiters see impact metrics and implementation cadence.",
  },
  {
    label: "Portfolio freshness",
    value: "Always current",
    description: "Syncs directly from GitHub instead of stale screenshots.",
  },
];

const workflow = [
  {
    title: "Connect",
    description:
      "Authorize GitHub once to pull repository metadata, commit history, and deployment links.",
  },
  {
    title: "Analyze",
    description:
      "The engine maps languages, commit velocity, and social proof into an impact-ready project profile.",
  },
  {
    title: "Publish",
    description:
      "Share a public portfolio URL that shows live demos, code snippets, and technical storylines.",
  },
];

export default function HomePage() {
  return (
    <main className="relative isolate flex-1 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(47,129,247,0.25), transparent 35%), radial-gradient(circle at 80% 0%, rgba(31,111,235,0.16), transparent 34%), linear-gradient(180deg, #0d1117 0%, #0f172a 55%, #0d1117 100%)",
        }}
      />

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#30363d] bg-[#111827] px-3 py-1 text-xs font-medium uppercase tracking-[0.17em] text-[#8b949e]">
              Portfolio Tools for Developers
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#f0f6fc] sm:text-5xl">
              Share your personal tech projects beautifully
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#9da7b3] sm:text-lg">
              personal-tech-showcase turns raw GitHub repositories into persuasive project
              stories with live demos, stack breakdowns, and engineering impact metrics.
              Stop sending flat portfolio lists that hide your actual problem-solving ability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string}
                className="rounded-lg border border-[#2f81f7] bg-[#1f6feb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f81f7]"
              >
                Start for $9/mo
              </a>
              <Link
                href="/dashboard"
                className="rounded-lg border border-[#30363d] bg-[#111827] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition hover:border-[#58a6ff]"
              >
                Open Dashboard
              </Link>
              <Link
                href="/unlock"
                className="rounded-lg border border-[#30363d] bg-[#0d1117] px-5 py-2.5 text-sm font-medium text-[#9da7b3] transition hover:text-[#e6edf3]"
              >
                I already purchased
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#30363d] bg-[#111827]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Why this converts</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#e6edf3]">
              Recruiters evaluate outcomes, not repository names
            </h2>
            <div className="mt-4 grid gap-3">
              {conversionStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                  <p className="text-xs uppercase tracking-wide text-[#8b949e]">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#58a6ff]">{item.value}</p>
                  <p className="mt-1 text-sm text-[#9da7b3]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#30363d] bg-[#111827]/95 p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Problem</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#e6edf3]">
            Traditional developer portfolios are hard to trust
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#9da7b3]">
            Most portfolios are static tiles with screenshots and buzzwords. They rarely
            show delivery cadence, technical depth, or project outcomes. Hiring managers
            and clients want evidence: what you built, how consistently you ship, and what
            impact your work had.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#30363d] bg-[#111827]/95 p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Solution</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#e6edf3]">
            Automated technical storytelling for every repo
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {workflow.map((step) => (
              <article key={step.title} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <p className="text-sm font-semibold text-[#58a6ff]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#9da7b3]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#2f81f7]/45 bg-[#0f172a] p-7 shadow-[0_0_0_1px_rgba(47,129,247,0.25)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#e6edf3]">$9 per month</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#9da7b3]">
            Built for mid-level developers and freelancers who need stronger technical
            positioning for interviews and client proposals.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-[#c9d1d9] sm:grid-cols-2">
            <li>- Unlimited repository sync runs</li>
            <li>- Public portfolio page per username</li>
            <li>- Tech stack and delivery metrics visualization</li>
            <li>- Code snippets and live demo links on every project card</li>
          </ul>
          <div className="mt-6">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string}
              className="inline-flex rounded-lg border border-[#2f81f7] bg-[#1f6feb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f81f7]"
            >
              Buy with Stripe Checkout
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#30363d] bg-[#111827]/95 p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">FAQ</p>
          <div className="mt-4 grid gap-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <h3 className="text-base font-semibold text-[#e6edf3]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9da7b3]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
