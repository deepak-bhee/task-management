import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Copy, Edit3, ListFilter, Plus, Search, Trash2 } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { TaskListSkeleton } from '../components/Skeleton.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { archiveTask, deleteTask, duplicateTask, getTasks } from '../services/taskService.js';
import { formatDate, isOverdue } from '../utils/date.js';
import { priorityStyles, statusStyles, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '../utils/taskConstants.js';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '', sortBy: 'createdAt', sortOrder: 'desc' });
  const { showToast } = useToast();

  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);

  async function loadTasks() {
    setIsLoading(true);
    try {
      const data = await getTasks({ ...query, limit: 30 });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load tasks.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [query]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function handleDuplicate(task) {
    try {
      await duplicateTask(task._id);
      showToast('Task duplicated.', 'success');
      loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to duplicate task.', 'error');
    }
  }

  async function handleArchive(task) {
    try {
      await archiveTask(task._id);
      showToast('Task archived.', 'success');
      loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to archive task.', 'error');
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await deleteTask(task._id);
      showToast('Task deleted.', 'success');
      loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete task.', 'error');
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">My Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">{pagination?.total || 0} active tasks in this view.</p>
        </div>
        <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" to="/tasks/new">
          <Plus className="h-4 w-4" />
          Create task
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_repeat(5,minmax(130px,160px))]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Search by title" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
          </label>
          <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)} aria-label="Filter by priority">
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {TASK_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={filters.sortBy} onChange={(event) => updateFilter('sortBy', event.target.value)} aria-label="Sort by">
            <option value="createdAt">Created</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')} type="button">
            <ListFilter className="h-4 w-4" />
            {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </section>

      {isLoading ? <TaskListSkeleton /> : null}
      {!isLoading && !tasks.length ? (
        <EmptyState title="No tasks found" description="Create a task or adjust the filters to bring work back into view." actionLabel="Create task" actionTo="/tasks/new" />
      ) : null}
      {!isLoading && tasks.length ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task._id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <Link className="min-w-0 flex-1" to={`/tasks/${task._id}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-slate-950">{task.title}</h2>
                    {isOverdue(task) ? <Badge className="bg-rose-50 text-rose-700 ring-rose-200">Overdue</Badge> : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{task.description || 'No description'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={statusStyles[task.status]}>{task.status}</Badge>
                    <Badge className={priorityStyles[task.priority]}>{task.priority}</Badge>
                    <Badge className="bg-slate-50 text-slate-600 ring-slate-200">{task.category}</Badge>
                    <span className="text-sm text-slate-500">{formatDate(task.dueDate)}</span>
                  </div>
                </Link>
                <div className="flex shrink-0 gap-2">
                  <Link className="rounded-md border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100" to={`/tasks/${task._id}/edit`} aria-label="Edit task">
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <button className="rounded-md border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100" onClick={() => handleDuplicate(task)} type="button" aria-label="Duplicate task">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="rounded-md border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100" onClick={() => handleArchive(task)} type="button" aria-label="Archive task">
                    <Archive className="h-4 w-4" />
                  </button>
                  <button className="rounded-md border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50" onClick={() => handleDelete(task)} type="button" aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
