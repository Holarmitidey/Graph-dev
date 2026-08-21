import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Job, JobMatch } from '../types';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Job ID is missing.');
      setLoading(false);
      return;
    }

    async function loadJob(jobId: string) {
      try {
        const [jobData, matchData] = await Promise.all([
          api.getJob(jobId),
          api.getJobMatches(jobId),
        ]);

        setJob(jobData);
        setMatches(matchData);
      } catch (err) {
        console.error(err);
        setError('Unable to load job details.');
      } finally {
        setLoading(false);
      }
    }

    loadJob(id);
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-800" />

          <div className="mt-8 h-72 animate-pulse rounded-2xl bg-slate-900" />

          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-900" />
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/jobs')}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-300">
            {error || 'Job not found.'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <button
          onClick={() => navigate('/jobs')}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        {/* Job information */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <BriefcaseBusiness size={24} />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {job.location}
            </div>

            <span className="rounded-lg bg-slate-800 px-3 py-1">
              {job.employmentType}
            </span>
          </div>

          <p className="mt-6 max-w-3xl leading-7 text-slate-400">
            {job.description}
          </p>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">
              Required Skills
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Developer recommendations */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Recommended Developers
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Developers ranked by how closely their profile
              matches this job.
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No developer matches found.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {matches.map((match) => (
                <div
                  key={match.developer.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div>
                      <button
                        onClick={() =>
                          navigate(
                            `/developers/${match.developer.id}`,
                          )
                        }
                        className="text-xl font-semibold transition hover:text-blue-400"
                      >
                        {match.developer.name}
                      </button>

                      <p className="mt-1 text-sm text-blue-400">
                        {match.developer.title}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {match.developer.location} ·{' '}
                        {match.developer.experienceYears} years
                        experience
                      </p>
                    </div>

                    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-blue-500/10">
                      <span className="text-2xl font-bold text-blue-400">
                        {Math.round(match.matchScore)}%
                      </span>

                      <span className="text-xs text-slate-500">
                        Match
                      </span>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-4">
                    <Score
                      label="Skills"
                      value={match.scoreBreakdown.skills}
                    />

                    <Score
                      label="Experience"
                      value={match.scoreBreakdown.experience}
                    />

                    <Score
                      label="Projects"
                      value={match.scoreBreakdown.projects}
                    />

                    <Score
                      label="Technologies"
                      value={match.scoreBreakdown.technologies}
                    />
                  </div>

                  {/* Matched skills */}
                  {match.matchedSkills.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium">
                        Matched Skills
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-300"
                          >
                            <CheckCircle2 size={13} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing skills */}
                  {match.missingSkills.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-medium">
                        Missing Skills
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300"
                          >
                            <XCircle size={13} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      navigate(
                        `/developers/${match.developer.id}`,
                      )
                    }
                    className="mt-6 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-700"
                  >
                    View Developer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Score({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {Math.round(value)}%
      </p>
    </div>
  );
}