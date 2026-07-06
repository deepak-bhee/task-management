import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, ListFilter } from 'lucide-react';

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link className="flex items-center gap-3" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">TF</span>
          <span className="font-bold text-slate-950">TaskFlow</span>
        </Link>
        <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" to="/login">Sign in</Link>
      </nav>
      <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 py-12 lg:grid-cols-[1fr_460px]">
        <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Task Management SaaS</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-slate-950 md:text-6xl">Plan, track, and finish work with clarity.</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          A modern productivity workspace for tasks, dashboards, deadlines, and personal workflow.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700" to="/register">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white" to="/login">
            Sign in
          </Link>
        </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
          <div className="grid gap-3">
            {[
              ['Dashboard analytics', BarChart3, 'Total, overdue, weekly activity'],
              ['Task filters', ListFilter, 'Status, priority, category, search'],
              ['Completion flow', CheckCircle2, 'Archive, duplicate, update']
            ].map(([title, Icon, description]) => (
              <div key={title} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-indigo-700"><Icon className="h-5 w-5" /></span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{title}</span>
                  <span className="block text-sm text-slate-500">{description}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
