import { Octokit } from "@octokit/rest";
import type {
  GitHubCommitSummary,
  PortfolioProject,
  ProjectMetric,
  ProjectTechStackItem,
  RepoSyncResult,
} from "@/types/portfolio";

const MAX_REPOS = 8;
const MAX_COMMITS = 15;
const LOOKBACK_DAYS = 30;

const CODE_FILE_CANDIDATES = [
  "app/page.tsx",
  "src/app/page.tsx",
  "pages/index.tsx",
  "main.ts",
  "main.tsx",
  "index.ts",
  "index.tsx",
  "server.ts",
  "README.md",
];

function decodeBase64(content: string) {
  return Buffer.from(content, "base64").toString("utf-8");
}

function summarizeMarkdown(text: string, maxLength = 260) {
  const normalized = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/#+\s?/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[>*_\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

function normalizeSnippet(text: string, maxLines = 22) {
  const lines = text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, maxLines)
    .join("\n");

  return lines.trim();
}

function detectCodeLanguage(filePath: string) {
  if (filePath.endsWith(".tsx")) return "tsx";
  if (filePath.endsWith(".ts")) return "typescript";
  if (filePath.endsWith(".jsx")) return "jsx";
  if (filePath.endsWith(".js")) return "javascript";
  if (filePath.endsWith(".py")) return "python";
  if (filePath.endsWith(".go")) return "go";
  if (filePath.endsWith(".rs")) return "rust";
  if (filePath.endsWith(".md")) return "markdown";

  return "text";
}

function buildImpactScore(
  stars: number,
  forks: number,
  commitCount: number,
  weeklyVelocity: number,
) {
  const score = Math.round(
    stars * 0.6 + forks * 0.8 + commitCount * 0.9 + weeklyVelocity * 5,
  );

  return Math.max(10, Math.min(score, 100));
}

function buildMetrics(
  stars: number,
  forks: number,
  commitCount: number,
  weeklyVelocity: number,
): ProjectMetric[] {
  return [
    {
      label: "Stars",
      value: stars,
      hint: "Signals community demand",
    },
    {
      label: "Forks",
      value: forks,
      hint: "Shows implementation reuse",
    },
    {
      label: "Commits (30d)",
      value: commitCount,
      hint: "Recent product momentum",
    },
    {
      label: "Weekly Velocity",
      value: Number(weeklyVelocity.toFixed(1)),
      hint: "Average commits per week",
    },
  ];
}

function aggregateTechStack(projects: PortfolioProject[]): ProjectTechStackItem[] {
  const totals = new Map<string, number>();

  for (const project of projects) {
    for (const item of project.techStack) {
      totals.set(item.name, (totals.get(item.name) ?? 0) + item.percentage);
    }
  }

  const entries = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const sum = entries.reduce((acc, [, value]) => acc + value, 0) || 1;

  return entries.map(([name, value]) => ({
    name,
    percentage: Number(((value / sum) * 100).toFixed(1)),
  }));
}

async function tryReadmeSnippet(octokit: Octokit, owner: string, repo: string) {
  try {
    const readme = await octokit.repos.getReadme({ owner, repo });
    const content = decodeBase64(readme.data.content);

    return summarizeMarkdown(content);
  } catch {
    return "No README detected yet. Add a README to improve your portfolio story and explain your architectural decisions.";
  }
}

async function tryCodeSnippet(
  octokit: Octokit,
  owner: string,
  repo: string,
  defaultBranch: string,
): Promise<{ snippet: string; language: string }> {
  for (const filePath of CODE_FILE_CANDIDATES) {
    try {
      const file = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: defaultBranch,
      });

      if (!Array.isArray(file.data) && "content" in file.data && file.data.content) {
        const content = decodeBase64(file.data.content);

        return {
          snippet: normalizeSnippet(content),
          language: detectCodeLanguage(filePath),
        };
      }
    } catch {
      // Try next candidate file.
    }
  }

  return {
    snippet:
      "No code snippet could be extracted automatically yet. Add one of: app/page.tsx, main.ts, index.ts, or server.ts for richer previews.",
    language: "text",
  };
}

function toTechStack(languageBreakdown: Record<string, number>): ProjectTechStackItem[] {
  const totalBytes = Object.values(languageBreakdown).reduce(
    (acc, value) => acc + value,
    0,
  );

  if (!totalBytes) {
    return [{ name: "Unknown", percentage: 100 }];
  }

  return Object.entries(languageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({
      name,
      percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
    }));
}

function getDefaultDescription(name: string, primaryLanguage: string) {
  return `${name} is a ${primaryLanguage} project with measurable engineering output and clear delivery signals for recruiters and clients.`;
}

export function createOctokit(token?: string) {
  return new Octokit(token ? { auth: token } : {});
}

export async function fetchPortfolioProjects({
  username,
  token,
}: {
  username: string;
  token?: string;
}): Promise<RepoSyncResult> {
  const octokit = createOctokit(token);
  const owner = username.trim();

  const reposResponse = await octokit.repos.listForUser({
    username: owner,
    sort: "updated",
    direction: "desc",
    per_page: MAX_REPOS,
    type: "owner",
  });

  const repos = reposResponse.data.filter((repo) => !repo.private).slice(0, MAX_REPOS);
  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const projects = await Promise.all(
    repos.map(async (repo): Promise<PortfolioProject> => {
      const [languagesResult, commitsResult, readmeSnippet, snippetResult] =
        await Promise.all([
          octokit.repos
            .listLanguages({ owner, repo: repo.name })
            .then((response) => response.data)
            .catch(() => ({} as Record<string, number>)),
          octokit.repos
            .listCommits({
              owner,
              repo: repo.name,
              per_page: MAX_COMMITS,
              since,
              sha: repo.default_branch,
            })
            .then((response) => response.data)
            .catch(() => []),
          tryReadmeSnippet(octokit, owner, repo.name),
          tryCodeSnippet(octokit, owner, repo.name, repo.default_branch ?? "main"),
        ]);

      const commits = commitsResult.slice(0, 5);

      const recentCommits: GitHubCommitSummary[] = commits.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message.split("\n")[0] ?? "Update",
        committedAt: commit.commit.author?.date ?? repo.pushed_at ?? repo.created_at ?? new Date().toISOString(),
        additions: 0,
        deletions: 0,
      }));

      const stars = repo.stargazers_count ?? 0;
      const forks = repo.forks_count ?? 0;
      const openIssues = repo.open_issues_count ?? 0;
      const commitCount30d = commitsResult.length;
      const weeklyVelocity = commitCount30d / Math.max(LOOKBACK_DAYS / 7, 1);
      const impactScore = buildImpactScore(
        stars,
        forks,
        commitCount30d,
        weeklyVelocity,
      );

      const repoName = repo.name ?? "untitled-repo";
      const createdAt = repo.created_at ?? new Date().toISOString();
      const pushedAt = repo.pushed_at ?? repo.updated_at ?? createdAt;
      const defaultBranch = repo.default_branch ?? "main";
      const repoId =
        repo.id ??
        Math.abs(
          [...repoName].reduce((acc, character) => acc + character.charCodeAt(0), 0),
        );

      return {
        id: repoId,
        name: repoName,
        fullName: repo.full_name ?? `${owner}/${repoName}`,
        description:
          repo.description?.trim() ||
          getDefaultDescription(repoName, repo.language ?? "multi-language"),
        repoUrl: repo.html_url ?? `https://github.com/${owner}/${repoName}`,
        homepageUrl: repo.homepage || null,
        defaultBranch,
        archived: repo.archived ?? false,
        primaryLanguage: repo.language || "Unknown",
        topics: repo.topics || [],
        stars,
        forks,
        openIssues,
        createdAt,
        pushedAt,
        commitCount30d,
        weeklyVelocity: Number(weeklyVelocity.toFixed(1)),
        impactScore,
        readmeSnippet,
        codeSnippet: snippetResult.snippet,
        codeLanguage: snippetResult.language,
        techStack: toTechStack(languagesResult),
        recentCommits,
        metrics: buildMetrics(
          stars,
          forks,
          commitCount30d,
          weeklyVelocity,
        ),
      };
    }),
  );

  const topTechnologies = aggregateTechStack(projects);

  return {
    success: true,
    username: owner,
    generatedAt: new Date().toISOString(),
    projects,
    topTechnologies,
    totals: {
      stars: projects.reduce((acc, project) => acc + project.stars, 0),
      commits30d: projects.reduce((acc, project) => acc + project.commitCount30d, 0),
      projects: projects.length,
    },
  };
}

export async function fetchPortfolioByUsername(username: string) {
  return fetchPortfolioProjects({ username });
}
