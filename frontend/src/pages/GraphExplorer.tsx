import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface GraphEntity {
  id: string;
  name: string;
  category?: string;
  type?: string;
}

interface DeveloperGraph {
  developer: {
    id: string;
    name: string;
    title: string;
    location: string;
    experienceYears: number;
  };
  skills: GraphEntity[];
  projects: GraphEntity[];
  technologies: GraphEntity[];
}

interface GeneralGraph {
  node: GraphEntity & {
    title?: string;
    description?: string;
    location?: string;
    employmentType?: string;
    experienceYears?: number;
  };
  connections: Array<{
    id: string;
    name: string;
    title?: string;
    type: string;
    relationship: string;
  }>;
}

export default function GraphExplorer() {
  const navigate = useNavigate();

  const [type, setType] = useState('developer');
  const [id, setId] = useState('');

  const [data, setData] = useState<
    DeveloperGraph | GeneralGraph | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function exploreGraph() {
    if (!id.trim()) {
      setError('Please enter an ID.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      let result;

      if (type === 'developer') {
        result = await api.getDeveloperGraph(id.trim());
      } else {
        result = await api.getGraph(type, id.trim());
      }

      console.log('Graph data:', result);

      if (!result) {
        setError(
          `${type.charAt(0).toUpperCase() + type.slice(1)} not found.`,
        );
        return;
      }

      setData(result as DeveloperGraph | GeneralGraph);
    } catch (err) {
      console.error(err);
      setError('Unable to load graph data.');
    } finally {
      setLoading(false);
    }
  }

  const isDeveloperGraph =
    type === 'developer' &&
    data &&
    'developer' in data;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVGRAPH
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Graph Explorer
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Explore the relationships between developers,
            skills, technologies, projects, companies, and jobs.
          </p>
        </div>

        {/* Search */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-5 md:grid-cols-[200px_1fr_auto] md:items-end">

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Node Type
              </label>

              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setId('');
                  setData(null);
                  setError('');
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="developer">
                  Developer
                </option>

                <option value="skill">
                  Skill
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="project">
                  Project
                </option>

                <option value="company">
                  Company
                </option>

                <option value="job">
                  Job
                </option>
              </select>
            </div>

            {/* ID */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {type.charAt(0).toUpperCase() + type.slice(1)} ID
              </label>

              <input
                type="text"
                value={id}
                onChange={(event) => setId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    exploreGraph();
                  }
                }}
                placeholder={
                  type === 'developer'
                    ? 'e.g. dev_001'
                    : type === 'skill'
                      ? 'e.g. skill_python'
                      : type === 'technology'
                        ? 'e.g. tech_nestjs'
                        : type === 'project'
                          ? 'e.g. project_remitcompare'
                          : type === 'company'
                            ? 'e.g. company_001'
                            : 'e.g. job_001'
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <button
              onClick={exploreGraph}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search size={17} />

              {loading ? 'Exploring...' : 'Explore'}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        {/* Loading */}
        {loading && (
          <section className="mt-8">
            <div className="h-48 animate-pulse rounded-2xl bg-slate-900" />
          </section>
        )}

        {/* Developer Results */}
        {isDeveloperGraph && !loading && (
          <section className="mt-8">

            {(() => {
              const developerData = data as DeveloperGraph;

              return (
                <>
                  {/* Developer */}
                  <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-400">
                      Developer
                    </p>

                    <div className="mt-3">
                      <h2 className="text-2xl font-bold">
                        {developerData.developer.name}
                      </h2>

                      <p className="mt-1 text-blue-400">
                        {developerData.developer.title}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>
                          {developerData.developer.location}
                        </span>

                        <span>
                          {developerData.developer.experienceYears}{' '}
                          years experience
                        </span>

                        <span>
                          ID: {developerData.developer.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        Skills
                      </h2>

                      <span className="text-sm text-slate-500">
                        {developerData.skills.length} skills
                      </span>
                    </div>

                    {developerData.skills.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-500">
                        No skills found.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {developerData.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                          >
                            <h3 className="font-medium">
                              {skill.name}
                            </h3>

                            {skill.category && (
                              <p className="mt-1 text-xs text-slate-500">
                                {skill.category}
                              </p>
                            )}

                            <p className="mt-4 text-xs font-medium text-blue-400">
                              HAS_SKILL
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        Projects
                      </h2>

                      <span className="text-sm text-slate-500">
                        {developerData.projects.length} projects
                      </span>
                    </div>

                    {developerData.projects.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-500">
                        No projects found.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {developerData.projects.map((project) => (
                          <div
                            key={project.id}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-semibold">
                                {project.name}
                              </h3>

                              {project.type && (
                                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                                  {project.type}
                                </span>
                              )}
                            </div>

                            <p className="mt-4 text-xs font-medium text-blue-400">
                              WORKED_ON
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        Technologies
                      </h2>

                      <span className="text-sm text-slate-500">
                        {developerData.technologies.length}{' '}
                        technologies
                      </span>
                    </div>

                    {developerData.technologies.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-500">
                        No technologies found.
                      </p>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {developerData.technologies.map(
                          (technology) => (
                            <div
                              key={technology.id}
                              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                            >
                              <p className="font-medium">
                                {technology.name}
                              </p>

                              {technology.category && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {technology.category}
                                </p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">
                      Graph Summary
                    </h2>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-950 p-4">
                        <p className="text-sm text-slate-500">
                          Skills
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {developerData.skills.length}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950 p-4">
                        <p className="text-sm text-slate-500">
                          Projects
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {developerData.projects.length}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950 p-4">
                        <p className="text-sm text-slate-500">
                          Technologies
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {developerData.technologies.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </section>
        )}

        {/* General Graph Results */}
        {data && !isDeveloperGraph && !loading && (
          <section className="mt-8">

            {(() => {
              const graphData = data as GeneralGraph;

              return (
                <>
                  {/* Node */}
                  <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-400">
                      {graphData.node.type || type}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                      {graphData.node.name}
                    </h2>

                    {graphData.node.category && (
                      <p className="mt-1 text-blue-400">
                        {graphData.node.category}
                      </p>
                    )}

                    {graphData.node.title && (
                      <p className="mt-1 text-blue-400">
                        {graphData.node.title}
                      </p>
                    )}

                    {graphData.node.description && (
                      <p className="mt-5 max-w-3xl leading-7 text-slate-400">
                        {graphData.node.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>
                        ID: {graphData.node.id}
                      </span>

                      {graphData.node.location && (
                        <span>
                          {graphData.node.location}
                        </span>
                      )}

                      {graphData.node.experienceYears !==
                        undefined && (
                        <span>
                          {graphData.node.experienceYears} years
                          experience
                        </span>
                      )}

                      {graphData.node.employmentType && (
                        <span>
                          {graphData.node.employmentType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connections */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        Connections
                      </h2>

                      <span className="text-sm text-slate-500">
                        {graphData.connections.length} connections
                      </span>
                    </div>

                    {graphData.connections.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-500">
                        No connections found.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {graphData.connections.map(
                          (connection) => (
                            <div
                              key={`${connection.id}-${connection.relationship}`}
                              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="font-semibold">
                                  {connection.name}
                                </h3>

                                <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-500">
                                  {connection.type}
                                </span>
                              </div>

                              {connection.title && (
                                <p className="mt-2 text-sm text-blue-400">
                                  {connection.title}
                                </p>
                              )}

                              <p className="mt-4 text-xs font-medium text-blue-400">
                                {connection.relationship}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {connection.id}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </section>
        )}

        {/* Empty state */}
        {!data && !loading && !error && (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center">
            <Search
              size={32}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold">
              Explore the graph
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Select a node type and enter its ID to explore
              its connections.
            </p>
          </section>
        )}

      </div>
    </main>
  );
}