import { useEffect, useState } from 'react';
import { BriefcaseBusiness, MapPin } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Job } from '../types';

export default function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await api.getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load jobs.');
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
            <ArrowLeft size={16} />
            Back to Dashboard
        </button>

        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVGRAPH
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Jobs
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Explore job opportunities and discover developers
            who best match each position.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-slate-900"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No jobs found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/50 hover:bg-slate-900/80"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BriefcaseBusiness size={22} />
                </div>

                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    {job.location}
                  </div>

                  <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs">
                    {job.employmentType}
                  </span>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                  {job.description}
                </p>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Required skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}