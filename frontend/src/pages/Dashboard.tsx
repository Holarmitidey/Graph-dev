import { useEffect, useState } from 'react';
import { Code2, Users, BriefcaseBusiness, FolderKanban } from 'lucide-react';
import { api } from '../services/api';

interface DashboardStats {
  developers: number;
  skills: number;
  projects: number;
  jobs: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    developers: 0,
    skills: 0,
    projects: 0,
    jobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [developers, skills, projects, jobs] =
          await Promise.all([
            api.getDevelopers(),
            api.getSkills(),
            api.getProjects(),
            api.getJobs(),
          ]);

        setStats({
          developers: developers.length,
          skills: skills.length,
          projects: projects.length,
          jobs: jobs.length,
        });
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      label: 'Developers',
      value: stats.developers,
      icon: Users,
    },
    {
      label: 'Skills',
      value: stats.skills,
      icon: Code2,
    },
    {
      label: 'Projects',
      value: stats.projects,
      icon: FolderKanban,
    },
    {
      label: 'Jobs',
      value: stats.jobs,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVGRAPH
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Developer Intelligence
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Explore developers, skills, technologies, projects and
            job relationships through a connected knowledge graph.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading ? '—' : card.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                Explore developers
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                Browse developers, their skills, experience, and connected
                projects.
                </p>

                <button
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500"
                onClick={() => {
                    window.location.href = '/developers';
                }}
                >
                View Developers
                </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                Explore the graph
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                Discover how developers connect to skills, projects,
                technologies and companies.
                </p>

                <button
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500"
                onClick={() => {
                    window.location.href = '/graph';
                }}
                >
                Open Graph Explorer
                </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                Find the right developer
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                Compare developer skills against job requirements and
                discover the strongest matches.
                </p>

                <button
                className="mt-6 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium transition hover:bg-slate-700"
                onClick={() => {
                    window.location.href = '/jobs';
                }}
                >
                View Jobs
                </button>
            </div>
        </section>
      </div>
    </main>
  );
}