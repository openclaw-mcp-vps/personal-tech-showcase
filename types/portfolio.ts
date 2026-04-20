export interface RepoCommit {
  sha: string;
  message: string;
  authoredAt: string;
  authorName: string;
}

export interface ImpactMetrics {
  commits30d: number;
  stars: number;
  forks: number;
  openIssues: number;
  releaseCadence: "high" | "medium" | "low";
}

export interface PortfolioProject {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  demoUrl?: string;
  homepage?: string;
  primaryLanguage: string;
  techStack: string[];
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  recentCommits: RepoCommit[];
  commitVelocity: number;
  readmeSnippet: string;
  lastUpdatedAt: string;
  metrics: ImpactMetrics;
  story: string;
}

export interface PortfolioConfig {
  username: string;
  title: string;
  summary: string;
  projects: PortfolioProject[];
  featuredProjectIds: number[];
  updatedAt: string;
}

export interface PortfolioAnalysis {
  totalProjects: number;
  totalStars: number;
  averageCommitVelocity: number;
  dominantStack: string[];
  strongestProject?: PortfolioProject;
  skillSignals: string[];
}
