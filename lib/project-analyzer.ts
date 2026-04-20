import type { PortfolioAnalysis, PortfolioProject } from "@/types/portfolio";

function rankProjectStrength(project: PortfolioProject) {
  const cadenceScore = project.metrics.commits30d * 1.7;
  const adoptionScore = project.metrics.stars * 2 + project.metrics.forks * 3;
  const qualityScore = Math.max(0, 20 - project.metrics.openIssues);
  const demoScore = project.demoUrl ? 25 : 0;

  return cadenceScore + adoptionScore + qualityScore + demoScore;
}

export function deriveSkillSignals(projects: PortfolioProject[]) {
  const languageFrequency = new Map<string, number>();
  const skillSignals: string[] = [];

  for (const project of projects) {
    for (const tech of project.techStack) {
      languageFrequency.set(tech, (languageFrequency.get(tech) ?? 0) + 1);
    }
  }

  const dominantTechnologies = [...languageFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tech]) => tech);

  if (dominantTechnologies.length > 0) {
    skillSignals.push(`Strong implementation depth across ${dominantTechnologies.join(", ")}`);
  }

  if (projects.some((project) => project.demoUrl)) {
    skillSignals.push("Ships live, reviewable demos rather than repository-only artifacts");
  }

  if (projects.filter((project) => project.metrics.commits30d >= 6).length >= 2) {
    skillSignals.push("Maintains consistent release cadence on multiple codebases");
  }

  if (projects.some((project) => project.stars >= 20 || project.forks >= 8)) {
    skillSignals.push("Has external adoption signals through stars and forks");
  }

  return skillSignals;
}

export function analyzePortfolio(projects: PortfolioProject[]): PortfolioAnalysis {
  const totalProjects = projects.length;
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const averageCommitVelocity =
    totalProjects === 0
      ? 0
      : Number((projects.reduce((sum, project) => sum + project.commitVelocity, 0) / totalProjects).toFixed(1));

  const dominantStack = [...new Set(projects.flatMap((project) => project.techStack))].slice(0, 8);
  const strongestProject = [...projects].sort((a, b) => rankProjectStrength(b) - rankProjectStrength(a))[0];

  return {
    totalProjects,
    totalStars,
    averageCommitVelocity,
    dominantStack,
    strongestProject,
    skillSignals: deriveSkillSignals(projects)
  };
}
