# Build Task: personal-tech-showcase

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: personal-tech-showcase
HEADLINE: Share your personal tech projects beautifully
WHAT: A portfolio builder that turns your GitHub repos into beautiful project showcases with live demos, tech stack highlights, and impact metrics. Automatically pulls commit history, deployment links, and code snippets to tell the story behind each project.
WHY: Developers spend hours manually creating portfolio sites that don't effectively communicate their technical skills to recruiters and clients. Most portfolios are static lists that fail to demonstrate actual problem-solving ability and technical depth.
WHO PAYS: Mid-level developers at startups or freelancers who need to showcase technical projects for job applications, client acquisition, or personal branding. Particularly useful for full-stack developers with multiple deployed projects.
NICHE: portfolio-tools
PRICE: $$9/mo

ARCHITECTURE SPEC:
A Next.js application that connects to GitHub API to fetch repository data, analyzes projects automatically, and generates beautiful portfolio showcases. Uses Supabase for user data and project configurations, with Lemon Squeezy handling subscriptions.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/showcase/[username]/page.tsx
- app/api/github/repos/route.ts
- app/api/github/analyze/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/ui/repo-card.tsx
- components/ui/tech-stack-badge.tsx
- components/ui/metrics-display.tsx
- components/portfolio-builder.tsx
- components/showcase-preview.tsx
- lib/github-api.ts
- lib/project-analyzer.ts
- lib/supabase.ts
- lib/lemonsqueezy.ts
- types/portfolio.ts

DEPENDENCIES: next, react, tailwindcss, @supabase/supabase-js, @lemonsqueezy/lemonsqueezy.js, octokit, framer-motion, lucide-react, date-fns, zod, react-hook-form

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}
- NO HEAVY ORMs: Do NOT use Prisma, Drizzle, TypeORM, Sequelize, or Mongoose. If the tool needs persistence, use direct SQL via `pg` (Postgres) or `better-sqlite3` (local), or just filesystem JSON. Reason: these ORMs require schema files and codegen steps that fail on Vercel when misconfigured.
- INTERNAL FILE DISCIPLINE: Every internal import (paths starting with `@/`, `./`, or `../`) MUST refer to a file you actually create in this build. If you write `import { Card } from "@/components/ui/card"`, then `components/ui/card.tsx` MUST exist with a real `export const Card` (or `export default Card`). Before finishing, scan all internal imports and verify every target file exists. Do NOT use shadcn/ui patterns unless you create every component from scratch — easier path: write all UI inline in the page that uses it.
- DEPENDENCY DISCIPLINE: Every package imported in any .ts, .tsx, .js, or .jsx file MUST be
  listed in package.json dependencies (or devDependencies for build-only). Before finishing,
  scan all source files for `import` statements and verify every external package (anything
  not starting with `.` or `@/`) appears in package.json. Common shadcn/ui peers that MUST
  be added if used:
  - lucide-react, clsx, tailwind-merge, class-variance-authority
  - react-hook-form, zod, @hookform/resolvers
  - @radix-ui/* (for any shadcn component)
- After running `npm run build`, if you see "Module not found: Can't resolve 'X'", add 'X'
  to package.json dependencies and re-run npm install + npm run build until it passes.

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.
