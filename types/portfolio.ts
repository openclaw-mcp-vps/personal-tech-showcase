export interface CommitPoint {
  date: string;
  count: number;
}

export interface ProjectMetric {
  stars: number;
  forks: number;
  openIssues: number;
  commitsLast30Days: number;
}

export interface CodeSnippet {
  fileName: string;
  language: string;
  content: string;
}

export interface ProjectShowcase {
  id: number;
  name: string;
  fullName: string;
  description: string;
  homepage: string | null;
  repoUrl: string;
  language: string;
  topics: string[];
  pushedAt: string;
  metrics: ProjectMetric;
  commitHistory: CommitPoint[];
  snippet: CodeSnippet;
}

export interface TechStackSummary {
  totalRepos: number;
  totalStars: number;
  primaryLanguages: Array<{ name: string; value: number }>;
  deploymentCoverage: number;
}

export interface PortfolioProfile {
  githubLogin: string;
  displayName: string;
  headline: string;
  summary: string;
  avatarUrl: string;
  syncedAt: string;
  projects: ProjectShowcase[];
  stackSummary: TechStackSummary;
}

export interface PortfolioSyncResponse {
  ok: boolean;
  portfolio: PortfolioProfile;
}
