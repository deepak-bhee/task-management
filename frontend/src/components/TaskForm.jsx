import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarClock, Save } from 'lucide-react';
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '../utils/taskConstants.js';
import { toDateInputValue } from '../utils/date.js';

export default function TaskForm({ initialTask, isSubmitting, onSubmit, submitLabel = 'Save task' }) {
  const defaultValues = useMemo(() => ({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    category: initialTask?.category || 'Personal',
    priority: initialTask?.priority || 'Medium',
    status: initialTask?.status || 'Pending',
    dueDate: toDateInputValue(initialTask?.dueDate),
    completed: Boolean(initialTask?.completed)
  }), [initialTask]);

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues, values: defaultValues });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="title">Title</label>
        <input
          id="title"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Write the next meaningful task"
          {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Use at least 2 characters' } })}
        />
        {errors.title ? <p className="mt-2 text-sm text-rose-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Add context, acceptance notes, links, or reminders"
          {...register('description')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Category
          <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('category')}>
            {TASK_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Priority
          <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('priority')}>
            {TASK_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Status
          <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('status')}>
            {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Due date
          <span className="relative mt-2 block">
            <CalendarClock className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="date" {...register('dueDate')} />
          </span>
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
        <input className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" {...register('completed')} />
        Mark as completed
      </label>

      <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        <Save className="h-4 w-4" />
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
