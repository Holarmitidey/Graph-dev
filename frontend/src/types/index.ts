export interface Developer {
  id: string;
  name: string;
  title: string;
  bio?: string;
  location: string;
  experienceYears: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  requiredSkills: string[];
}

export interface JobMatch {
  rank: number;
  developer: Developer;
  matchScore: number;

  scoreBreakdown: {
    skills: number;
    experience: number;
    projects: number;
    technologies: number;
  };

  matchedSkills: string[];
  missingSkills: string[];
  projects: Project[];
  technologies: Technology[];
}

export interface DeveloperGraph {
  developer: Developer;
  skills: Skill[];
  projects: Project[];
  technologies: Technology[];
}