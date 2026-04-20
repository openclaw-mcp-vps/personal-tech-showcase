export interface ProjectImpactMetrics {
  stars: number;
  forks: number;
  openIssues: number;
  contributors: number;
  commitsLast30Days: number;
  latestCommitAt: string | null;
  deploymentUrl: string | null;
  velocityLabel: string;
}

export interface PortfolioProject {
  id: number;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  stack: string[];
  snippet: string;
  updatedAt: string;
  pushedAt: string;
  impact: ProjectImpactMetrics;
}

export interface RepoSyncResponse {
  username: string;
  syncedAt: string;
  projects: PortfolioProject[];
}
