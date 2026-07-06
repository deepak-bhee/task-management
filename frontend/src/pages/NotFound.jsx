import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">404</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">The page may have moved, or the route does not exist.</p>
        <Link className="mt-6 inline-flex rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" to="/dashboard">
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
