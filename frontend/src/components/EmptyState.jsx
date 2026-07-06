import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <ClipboardList className="h-10 w-10 text-slate-400" />
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && actionTo ? (
        <Link className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
