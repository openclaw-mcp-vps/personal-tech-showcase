import { subDays } from "date-fns";
import { Octokit } from "octokit";

import type { PortfolioProject, RepoCommit } from "@/types/portfolio";

const DEFAULT_LOOKBACK_DAYS = 30;

function createOctokit(token?: string) {
  const auth = token || process.env.GITHUB_TOKEN;
  return auth ? new Octokit({ auth }) : new Octokit();
}

function decodeBase64(content: string) {
  return Buffer.from(content, "base64").toString("utf8");
}

function normalizeReadmeSnippet(readme: string) {
  const withoutCodeBlocks = readme.replace(/```[\s\S]*?```/g, "");
  const withoutHeaders = withoutCodeBlocks.replace(/^#{1,6}\s+/gm, "").trim();
  const firstParagraph = withoutHeaders.split(/\n\s*\n/).find((paragraph) => paragraph.trim().length > 80);

  if (!firstParagraph) {
    return "This project demonstrates production-level implementation choices, practical architecture, and measurable engineering outcomes.";
  }

  return firstParagraph.replace(/\s+/g, " ").slice(0, 320);
}

function resolveDemoUrl(homepage: string | null, topics: string[]) {
  if (homepage && /^https?:\/\//.test(homepage)) {
    return homepage;
  }

  if (topics.includes("vercel") || topics.includes("netlify") || topics.includes("demo")) {
    return homepage ?? undefined;
  }

  return undefined;
}

function buildStory(repoName: string, techStack: string[], commits30d: number, hasDemo: boolean, stars: number) {
  const stackPreview = techStack.slice(0, 3).join(", ");
  const maintenanceSignal = commits30d >= 8 ? "active delivery momentum" : "steady long-term maintenance";
  const proof = hasDemo
    ? "A live deployment is available, so reviewers can validate behavior end-to-end."
    : "The codebase is structured for extension, with clear modular boundaries and documentation-ready patterns.";

  return `${repoName} is built with ${stackPreview}, showing ${maintenanceSignal}. ${proof} Community validation includes ${stars} stars, reinforcing practical usefulness.`;
}

async function fetchRepoLanguages(octokit: Octokit, owner: string, repo: string) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/languages", {
      owner,
      repo
    });

    return Object.keys(response.data);
  } catch {
    return [] as string[];
  }
}

async function fetchRecentCommits(octokit: Octokit, owner: string, repo: string, since: string) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      per_page: 30,
      since
    });

    return response.data
      .map((item) => {
        const authoredAt = item.commit.author?.date;
        const authorName = item.commit.author?.name;

        if (!authoredAt || !authorName) {
          return null;
        }

        return {
          sha: item.sha,
          message: item.commit.message.split("\n")[0],
          authoredAt,
          authorName
        } satisfies RepoCommit;
      })
      .filter((entry): entry is RepoCommit => entry !== null);
  } catch {
    return [] as RepoCommit[];
  }
}

async function fetchReadmeSnippet(octokit: Octokit, owner: string, repo: string) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    const content = "content" in response.data ? response.data.content : "";
    if (!content) {
      return "The repository focuses on solving a concrete engineering problem with reusable implementation patterns and clear technical intent.";
    }

    return normalizeReadmeSnippet(decodeBase64(content));
  } catch {
    return "The repository focuses on solving a concrete engineering problem with reusable implementation patterns and clear technical intent.";
  }
}

export async function fetchUserRepos(username: string, token?: string, limit = 8) {
  const octokit = createOctokit(token);
  const response = await octokit.request("GET /users/{username}/repos", {
    username,
    sort: "updated",
    direction: "desc",
    per_page: Math.min(limit * 3, 100),
    type: "owner"
  });

  const cutoff = subDays(new Date(), DEFAULT_LOOKBACK_DAYS).toISOString();

  const selectedRepos = response.data
    .filter((repo) => !repo.fork)
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, limit);

  const projects = await Promise.all(
    selectedRepos.map(async (repo) => {
      const owner = repo.owner?.login ?? username;
      const languages = await fetchRepoLanguages(octokit, owner, repo.name);
      const recentCommits = await fetchRecentCommits(octokit, owner, repo.name, cutoff);
      const readmeSnippet = await fetchReadmeSnippet(octokit, owner, repo.name);
      const topicList = repo.topics ?? [];

      const techStack = Array.from(new Set([repo.language, ...languages, ...topicList])).filter(
        (language): language is string => Boolean(language)
      );

      const commitVelocity = recentCommits.length;
      const demoUrl = resolveDemoUrl(repo.homepage ?? null, topicList);

      const project: PortfolioProject = {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description:
          repo.description ??
          "This project ships a focused solution with production-ready code quality and clear technical scope.",
        htmlUrl: repo.html_url,
        demoUrl,
        homepage: repo.homepage ?? undefined,
        primaryLanguage: repo.language ?? languages[0] ?? "TypeScript",
        techStack,
        topics: topicList,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        openIssues: repo.open_issues_count ?? 0,
        watchers: repo.watchers_count ?? 0,
        recentCommits,
        commitVelocity,
        readmeSnippet,
        lastUpdatedAt: repo.updated_at ?? repo.pushed_at ?? new Date().toISOString(),
        metrics: {
          commits30d: commitVelocity,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          openIssues: repo.open_issues_count ?? 0,
          releaseCadence: commitVelocity >= 10 ? "high" : commitVelocity >= 4 ? "medium" : "low"
        },
        story: buildStory(repo.name, techStack, commitVelocity, Boolean(demoUrl), repo.stargazers_count ?? 0)
      };

      return project;
    })
  );

  return projects;
}
