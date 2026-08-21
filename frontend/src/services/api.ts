import type {
  Developer,
  Skill,
  Technology,
  Project,
  Job,
  JobMatch,
  DeveloperGraph,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getDevelopers: () =>
    request<Developer[]>('/developers'),

  getDeveloper: (id: string) =>
    request<Developer>(`/developers/${id}`),

//   getDeveloperGraph: (id: string) =>
//     request<DeveloperGraph>(`/developers/${id}/graph`),

  getJobs: () =>
    request<Job[]>('/jobs'),

  getJob: (id: string) =>
    request<Job>(`/jobs/${id}`),

  getJobMatches: (id: string) =>
    request<JobMatch[]>(`/jobs/${id}/recommendations`),

  getDeveloperJobMatch: (jobId: string, developerId: string) =>
    request<JobMatch>(
      `/jobs/${jobId}/match/${developerId}`,
    ),

  getGraph: (type: string, id: string) =>
    request<unknown>(`/graph/${type}/${id}`),

  getDeveloperGraph: (id: string) =>
    request<DeveloperGraph>(`/graph/developer/${id}`),

  getDeveloperConnections: (id: string) =>
    request<unknown>(`/graph/developer/${id}/connections`),

  getSkills: () =>
    request<Skill[]>('/skills'),

  getTechnologies: () =>
    request<Technology[]>('/technologies'),

  getProjects: () =>
    request<Project[]>('/projects'),
};