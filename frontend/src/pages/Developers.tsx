import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, BriefcaseBusiness } from 'lucide-react';
import { api } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Developer {
  id: string;
  name: string;
  title: string;
  bio?: string;
  location?: string;
  experienceYears?: number;
  skills?: string[];
}

export default function Developers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDevelopers() {
      try {
        const data = await api.getDevelopers();
        setDevelopers(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load developers.');
      } finally {
        setLoading(false);
      }
    }

    loadDevelopers();
  }, []);

  const filteredDevelopers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return developers;
    }

    return developers.filter((developer) => {
      return (
        developer.name.toLowerCase().includes(query) ||
        developer.title.toLowerCase().includes(query) ||
        developer.location?.toLowerCase().includes(query) ||
        developer.skills?.some((skill) =>
          skill.toLowerCase().includes(query),
        )
      );
    });
  }, [developers, search]);

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
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVGRAPH
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Developers
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Explore developers and the skills, experience, and
            technologies connected to them.
          </p>
        </div>

        <div className="relative mb-8 max-w-xl">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search developers, skills, locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">
              No developers found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Try a different name, skill, or location.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDevelopers.map((developer) => (
              <div
                key={developer.id}
                onClick={() => navigate(`/developers/${developer.id}`)}
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {developer.name}
                    </h2>

                    <p className="mt-1 text-sm text-blue-400">
                      {developer.title}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
                    {developer.name
                      .split(' ')
                      .map((name) => name[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                </div>

                {developer.bio && (
                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-400">
                    {developer.bio}
                  </p>
                )}

                <div className="space-y-2 text-sm text-slate-400">
                  {developer.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{developer.location}</span>
                    </div>
                  )}

                  {developer.experienceYears !== undefined && (
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness size={16} />
                      <span>
                        {developer.experienceYears} years experience
                      </span>
                    </div>
                  )}
                </div>

                {developer.skills && developer.skills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {developer.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}