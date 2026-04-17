import { Octokit } from "@octokit/rest";
import { z } from "zod";
import type {
  CodeSnippet,
  CommitPoint,
  PortfolioProfile,
  ProjectShowcase,
  TechStackSummary,
} from "@/types/portfolio";

const OAuthTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string().optional(),
});

export function createGitHubOAuthUrl(origin: string, state: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing GITHUB_CLIENT_ID");
  }

  const redirectUri = `${origin}/api/auth/github`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo read:user",
    state,
    allow_signup: "true",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCodeForToken(
  code: string,
  origin: string,
): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GitHub OAuth environment variables");
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/api/auth/github`,
    }),
  });

  const payload = OAuthTokenSchema.parse(await response.json());
  return payload.access_token;
}

function getFileLanguage(fileName: string): string {
  if (fileName.endsWith(".tsx") || fileName.endsWith(".ts")) return "typescript";
  if (fileName.endsWith(".jsx") || fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".py")) return "python";
  if (fileName.endsWith(".go")) return "go";
  if (fileName.endsWith(".rs")) return "rust";
  return "text";
}

async function getCodeSnippet(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<CodeSnippet> {
  try {
    const tree = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    });

    const snippetPath =
      tree.data.tree.find((item) =>
        item.path?.match(/(app\/page\.tsx|src\/App\.tsx|main\.py|index\.js)$/),
      )?.path ?? "README.md";

    const content = await octokit.repos.getContent({
      owner,
      repo,
      path: snippetPath,
    });

    if ("content" in content.data && content.data.content) {
      const decoded = Buffer.from(content.data.content, "base64").toString("utf8");
      return {
        fileName: snippetPath,
        language: getFileLanguage(snippetPath),
        content: decoded.slice(0, 480),
      };
    }
  } catch {
    // fall through to default snippet
  }

  return {
    fileName: "README.md",
    language: "markdown",
    content:
      "No code snippet could be extracted automatically. Sync again after pushing your latest branch and adding a project README.",
  };
}

async function getCommitHistory(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<{ commitsLast30Days: number; points: CommitPoint[] }> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const commits = await octokit.repos.listCommits({
    owner,
    repo,
    since,
    per_page: 100,
  });

  const dateMap = new Map<string, number>();
  commits.data.forEach((commit) => {
    const date = commit.commit.author?.date?.slice(0, 10);
    if (!date) return;
    dateMap.set(date, (dateMap.get(date) ?? 0) + 1);
  });

  const points = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    commitsLast30Days: commits.data.length,
    points,
  };
}

function buildStackSummary(projects: ProjectShowcase[]): TechStackSummary {
  const langCounts = new Map<string, number>();
  let deployed = 0;
  let stars = 0;

  projects.forEach((project) => {
    stars += project.metrics.stars;
    if (project.homepage) deployed += 1;
    if (project.language) {
      langCounts.set(project.language, (langCounts.get(project.language) ?? 0) + 1);
    }
  });

  const primaryLanguages = Array.from(langCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  return {
    totalRepos: projects.length,
    totalStars: stars,
    primaryLanguages,
    deploymentCoverage: projects.length
      ? Math.round((deployed / projects.length) * 100)
      : 0,
  };
}

export async function buildPortfolioFromGitHubToken(
  token: string,
): Promise<PortfolioProfile> {
  const octokit = new Octokit({ auth: token });
  const [{ data: user }, { data: repos }] = await Promise.all([
    octokit.users.getAuthenticated(),
    octokit.repos.listForAuthenticatedUser({
      sort: "pushed",
      per_page: 100,
      visibility: "all",
      affiliation: "owner",
    }),
  ]);

  const filteredRepos = repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime(),
    )
    .slice(0, 8);

  const projects = await Promise.all(
    filteredRepos.map(async (repo): Promise<ProjectShowcase> => {
      const [snippet, commitSummary] = await Promise.all([
        getCodeSnippet(octokit, user.login, repo.name),
        getCommitHistory(octokit, user.login, repo.name),
      ]);

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description:
          repo.description ??
          "This repository has no description yet. Add one to improve portfolio quality.",
        homepage: repo.homepage,
        repoUrl: repo.html_url,
        language: repo.language ?? "Unspecified",
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at ?? new Date().toISOString(),
        metrics: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: repo.open_issues_count,
          commitsLast30Days: commitSummary.commitsLast30Days,
        },
        commitHistory: commitSummary.points,
        snippet,
      };
    }),
  );

  const stackSummary = buildStackSummary(projects);

  return {
    githubLogin: user.login,
    displayName: user.name ?? user.login,
    headline: "Shipping practical software with measurable outcomes",
    summary:
      "This portfolio is generated from live repository signals: commit momentum, deployment coverage, and code-level implementation detail.",
    avatarUrl: user.avatar_url,
    syncedAt: new Date().toISOString(),
    projects,
    stackSummary,
  };
}
