import { formatDistanceToNowStrict } from "date-fns";
import { Octokit } from "@octokit/rest";

import { type PortfolioProject } from "@/types/portfolio";

interface OAuthTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

const TECH_KEYWORDS: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  go: "Go",
  rust: "Rust",
  docker: "Docker",
  kubernetes: "Kubernetes",
  postgres: "PostgreSQL",
  graphql: "GraphQL",
  node: "Node.js",
  next: "Next.js",
  react: "React",
  tailwind: "Tailwind CSS",
  redis: "Redis",
  aws: "AWS"
};

function createGitHubClient(token?: string) {
  return new Octokit({ auth: token });
}

function velocityLabel(commitsLast30Days: number): string {
  if (commitsLast30Days >= 40) return "High velocity";
  if (commitsLast30Days >= 15) return "Steady shipping";
  if (commitsLast30Days >= 5) return "Active maintenance";
  return "Low recent activity";
}

function inferTechStack(repo: GitHubRepo, languages: string[]): string[] {
  const stack = new Set<string>();

  if (repo.language) stack.add(repo.language);
  for (const topic of repo.topics ?? []) {
    const normalized = topic.toLowerCase();
    if (TECH_KEYWORDS[normalized]) {
      stack.add(TECH_KEYWORDS[normalized]);
    }
  }
  for (const language of languages) {
    stack.add(language);
  }

  return Array.from(stack).slice(0, 8);
}

function buildSnippet(repo: GitHubRepo, stack: string[]): string {
  const stackText = stack.slice(0, 3).join(", ");
  const description =
    repo.description?.trim() ||
    "Engineered with a focus on clean architecture, measurable impact, and resilient delivery.";

  return `${description} Built with ${stackText || "modern web tooling"} to solve a real product problem.`;
}

async function fetchRepoLanguages(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<string[]> {
  const response = await octokit.repos.listLanguages({ owner, repo });
  return Object.keys(response.data);
}

async function fetchCommitCountSince(
  octokit: Octokit,
  owner: string,
  repo: string,
  sinceIso: string
): Promise<number> {
  const response = await octokit.repos.listCommits({
    owner,
    repo,
    since: sinceIso,
    per_page: 100
  });

  return response.data.length;
}

async function fetchContributorCount(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<number> {
  const response = await octokit.repos.listContributors({
    owner,
    repo,
    per_page: 100
  });

  return response.data.length;
}

async function fetchLatestCommitAt(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<string | null> {
  const response = await octokit.repos.listCommits({ owner, repo, per_page: 1 });
  const latest = response.data[0];

  return latest?.commit?.author?.date ?? null;
}

async function toPortfolioProject(
  octokit: Octokit,
  repo: GitHubRepo
): Promise<PortfolioProject> {
  const owner = repo.owner.login;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [languages, commitsLast30Days, contributors, latestCommitAt] = await Promise.all([
    fetchRepoLanguages(octokit, owner, repo.name).catch(() => []),
    fetchCommitCountSince(octokit, owner, repo.name, thirtyDaysAgo).catch(() => 0),
    fetchContributorCount(octokit, owner, repo.name).catch(() => 1),
    fetchLatestCommitAt(octokit, owner, repo.name).catch(() => null)
  ]);

  const stack = inferTechStack(repo, languages);
  const lastCommitDistance = latestCommitAt
    ? formatDistanceToNowStrict(new Date(latestCommitAt), { addSuffix: true })
    : "recently";

  return {
    id: repo.id,
    owner,
    name: repo.name,
    fullName: repo.full_name,
    description:
      repo.description ||
      "A production-grade project focused on robust DX, reliability, and clear product outcomes.",
    htmlUrl: repo.html_url,
    homepageUrl: repo.homepage,
    language: repo.language,
    topics: repo.topics ?? [],
    stack,
    snippet: `${buildSnippet(repo, stack)} Latest meaningful activity: ${lastCommitDistance}.`,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    impact: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      contributors,
      commitsLast30Days,
      latestCommitAt,
      deploymentUrl: repo.homepage,
      velocityLabel: velocityLabel(commitsLast30Days)
    }
  };
}

export function getGitHubOAuthUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
}) {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", "read:user repo");
  url.searchParams.set("state", input.state);
  return url;
}

export async function exchangeGithubCodeForToken(
  code: string,
  redirectUri: string
): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth credentials are not configured.");
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  const data = (await response.json()) as OAuthTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "GitHub token exchange failed.");
  }

  return data.access_token;
}

export async function fetchGithubUser(token: string): Promise<{ login: string }> {
  const octokit = createGitHubClient(token);
  const { data } = await octokit.users.getAuthenticated();
  return { login: data.login };
}

export async function fetchPortfolioProjectsForViewer(
  token: string,
  limit = 12
): Promise<{ username: string; projects: PortfolioProject[] }> {
  const octokit = createGitHubClient(token);
  const [{ data: userData }, { data: repos }] = await Promise.all([
    octokit.users.getAuthenticated(),
    octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      sort: "updated",
      per_page: Math.min(Math.max(limit, 1), 30)
    })
  ]);

  const filteredRepos = repos
    .filter((repo) => !repo.fork)
    .slice(0, Math.min(limit, 12)) as unknown as GitHubRepo[];

  const projects = await Promise.all(
    filteredRepos.map((repo) => toPortfolioProject(octokit, repo))
  );

  return {
    username: userData.login,
    projects
  };
}

export async function fetchPublicPortfolioProjects(
  username: string,
  limit = 8
): Promise<PortfolioProject[]> {
  const octokit = createGitHubClient();

  const { data } = await octokit.repos.listForUser({
    username,
    sort: "updated",
    per_page: Math.min(Math.max(limit, 1), 20)
  });

  const repos = data.filter((repo) => !repo.fork).slice(0, limit) as unknown as GitHubRepo[];

  return Promise.all(repos.map((repo) => toPortfolioProject(octokit, repo)));
}
