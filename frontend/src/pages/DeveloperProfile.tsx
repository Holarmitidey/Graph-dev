import { useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type {
  Developer,
  Skill,
  Project,
  Technology,
  DeveloperGraph,
} from '../types';

export default function DeveloperProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
    if (!id) {
        setError('Developer ID is missing.');
        setLoading(false);
        return;
    }

    async function loadDeveloper(developerId: string) {
        try {
            const data = await api.getDeveloperGraph(developerId) as DeveloperGraph;

            setDeveloper(data.developer);
            setSkills(data.skills);
            setProjects(data.projects);
            setTechnologies(data.technologies);
        } catch (err) {
        console.error(err);
        setError('Unable to load developer profile.');
        } finally {
        setLoading(false);
        }
    }

    loadDeveloper(id);
    }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-800" />

          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-900" />
        </div>
      </main>
    );
  }

  if (error || !developer) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/developers')}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Developers
          </button>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-300">
            {error || 'Developer not found.'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <button
          onClick={() => navigate('/developers')}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Developers
        </button>

        {/* Profile header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl font-bold text-blue-400">
              {developer.name
                .split(' ')
                .map((name) => name[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {developer.name}
              </h1>

              <p className="mt-1 text-lg text-blue-400">
                {developer.title}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {developer.location}
                </div>

                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} />
                  {developer.experienceYears} years experience
                </div>
              </div>
            </div>
          </div>

          {developer.bio && (
            <p className="mt-8 max-w-3xl leading-7 text-slate-400">
              {developer.bio}
            </p>
          )}
        </section>

        {/* Skills */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Skills
          </h2>

          {skills.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No skills found.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="font-medium">
                    {skill.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {skill.category}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
            <h2 className="text-2xl font-semibold">
                Technologies
            </h2>

            {technologies.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                No technologies found.
                </p>
            ) : (
                <div className="mt-4 flex flex-wrap gap-3">
                {technologies.map((technology) => (
                    <div
                    key={technology.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                    >
                    <p className="font-medium">
                        {technology.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {technology.category}
                    </p>
                    </div>
                ))}
                </div>
            )}
        </section>

        {/* Projects */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Projects
          </h2>

          {projects.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No projects found.
            </p>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">
                      {project.name}
                    </h3>

                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                      {project.type}
                    </span>
                  </div>

                  {project.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}