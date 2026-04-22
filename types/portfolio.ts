export interface GitHubCommitSummary {
  sha: string;
  message: string;
  committedAt: string;
  additions: number;
  deletions: number;
}

export interface ProjectMetric {
  label: string;
  value: number;
  hint: string;
}

export interface ProjectTechStackItem {
  name: string;
  percentage: number;
}

export interface PortfolioProject {
  id: number;
  name: string;
  fullName: string;
  description: string;
  repoUrl: string;
  homepageUrl: string | null;
  defaultBranch: string;
  archived: boolean;
  primaryLanguage: string;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  pushedAt: string;
  commitCount30d: number;
  weeklyVelocity: number;
  impactScore: number;
  readmeSnippet: string;
  codeSnippet: string;
  codeLanguage: string;
  techStack: ProjectTechStackItem[];
  recentCommits: GitHubCommitSummary[];
  metrics: ProjectMetric[];
}

export interface PortfolioSummary {
  username: string;
  generatedAt: string;
  projects: PortfolioProject[];
  totalStars: number;
  totalCommits30d: number;
  averageVelocity: number;
  topTechnologies: ProjectTechStackItem[];
}

export interface RepoSyncResult {
  success: boolean;
  username: string;
  projects: PortfolioProject[];
  generatedAt: string;
  topTechnologies: ProjectTechStackItem[];
  totals: {
    stars: number;
    commits30d: number;
    projects: number;
  };
}
