import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, ListTodo, Plus } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import { TaskListSkeleton } from '../components/Skeleton.jsx';
import { getTasks } from '../services/taskService.js';
import { formatDate, isOverdue } from '../utils/date.js';
import { statusStyles } from '../utils/taskConstants.js';
import PieChart from '../components/Charts/PieChart.jsx';
import BarChart from '../components/Charts/BarChart.jsx';
import TaskFilters from '../components/TaskFilters.jsx';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });

  useEffect(() => {
    setIsLoading(true);

    getTasks(filters)
      .then(({ tasks: items }) => setTasks(items))
      .catch(() => setTasks([]))
      .finally(() => setIsLoading(false));
  }, [filters]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'Completed' || task.completed).length;
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
    const overdue = tasks.filter(isOverdue).length;

    return [
      { label: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'text-slate-700' },
      { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-600' },
      { label: 'Pending', value: tasks.filter((task) => task.status === 'Pending').length, icon: Clock3, color: 'text-amber-600' },
      { label: 'In Progress', value: inProgress, icon: CalendarDays, color: 'text-sky-600' },
      { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-rose-600' }
    ];
  }, [tasks]);

  const weeklyActivity = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, offset) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - offset));
      return { label: date.toLocaleDateString('en', { weekday: 'short' }), count: 0, date: date.toDateString() };
    });

    tasks.forEach((task) => {
      const day = days.find((item) => item.date === new Date(task.createdAt).toDateString());
      if (day) day.count += 1;
    });

    return days;
  }, [tasks]);

  const maxActivity = Math.max(...weeklyActivity.map((day) => day.count), 1);
  const recentTasks = tasks.slice(0, 5);
  const upcomingTasks = tasks
    .filter((task) => task.dueDate && task.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">A focused view of workload, deadlines, and momentum.</p>
        </div>
        <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" to="/tasks/new">
          <Plus className="h-4 w-4" />
          Quick add
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{stat.value}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Weekly activity</h2>
          <div className="mt-6">
            <BarChart labels={weeklyActivity.map((d) => d.label)} values={weeklyActivity.map((d) => d.count)} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Status mix</h2>
          <div className="mt-6">
            <PieChart
              labels={[ 'Pending', 'In Progress', 'Completed' ]}
              values={[
                tasks.filter((t) => t.status === 'Pending').length,
                tasks.filter((t) => t.status === 'In Progress').length,
                tasks.filter((t) => t.status === 'Completed' || t.completed).length
              ]}
              colors={[ '#f59e0b', '#06b6d4', '#10b981' ]}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Recent tasks</h2>
            <TaskFilters filters={filters} onChange={(next) => setFilters({ ...filters, ...next })} />
          </div>
          {isLoading ? <TaskListSkeleton /> : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <Link key={task._id} className="block rounded-lg border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40" to={`/tasks/${task._id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <Badge className={statusStyles[task.status]}>{task.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{task.description || 'No description'}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Upcoming deadlines</h2>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <Link key={task._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40" to={`/tasks/${task._id}`}>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-slate-950">{task.title}</span>
                  <span className="text-sm text-slate-500">{task.category}</span>
                </span>
                <span className={isOverdue(task) ? 'text-sm font-semibold text-rose-600' : 'text-sm font-medium text-slate-500'}>{formatDate(task.dueDate)}</span>
              </Link>
            ))}
            {!upcomingTasks.length && !isLoading ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No upcoming deadlines yet.</p> : null}
          </div>
        </section>
      </div>
    </section>
  );
}
