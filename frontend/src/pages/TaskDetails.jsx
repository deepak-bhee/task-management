import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, Copy, Edit3, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { archiveTask, deleteTask, duplicateTask, getTask, restoreTask, updateTask } from '../services/taskService.js';
import { formatDate, isOverdue } from '../utils/date.js';
import { priorityStyles, statusStyles } from '../utils/taskConstants.js';

export default function TaskDetails() {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function loadTask() {
    setIsLoading(true);
    try {
      const data = await getTask(id);
      setTask(data.task);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load task.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTask();
  }, [id]);

  async function handleComplete() {
    try {
      const { task: updatedTask } = await updateTask(id, { status: task.completed ? 'Pending' : 'Completed', completed: !task.completed });
      setTask(updatedTask);
      showToast(updatedTask.completed ? 'Task completed.' : 'Task reopened.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update task.', 'error');
    }
  }

  async function handleDuplicate() {
    try {
      const { task: copy } = await duplicateTask(id);
      showToast('Task duplicated.', 'success');
      navigate(`/tasks/${copy._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to duplicate task.', 'error');
    }
  }

  async function handleArchiveToggle() {
    try {
      const { task: updatedTask } = task.archived ? await restoreTask(id) : await archiveTask(id);
      setTask(updatedTask);
      showToast(updatedTask.archived ? 'Task archived.' : 'Task restored.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update archive status.', 'error');
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await deleteTask(id);
      showToast('Task deleted.', 'success');
      navigate('/tasks');
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete task.', 'error');
    }
  }

  if (isLoading) {
    return <div className="grid min-h-72 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  if (!task) {
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to="/tasks">
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge className={statusStyles[task.status]}>{task.status}</Badge>
              <Badge className={priorityStyles[task.priority]}>{task.priority}</Badge>
              <Badge className="bg-slate-50 text-slate-600 ring-slate-200">{task.category}</Badge>
              {isOverdue(task) ? <Badge className="bg-rose-50 text-rose-700 ring-rose-200">Overdue</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold text-slate-950">{task.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.description || 'No description added.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100" onClick={handleComplete} type="button" aria-label="Toggle completion">
              <RotateCcw className="h-4 w-4" />
            </button>
            <Link className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100" to={`/tasks/${id}/edit`} aria-label="Edit task">
              <Edit3 className="h-4 w-4" />
            </Link>
            <button className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100" onClick={handleDuplicate} type="button" aria-label="Duplicate task">
              <Copy className="h-4 w-4" />
            </button>
            <button className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100" onClick={handleArchiveToggle} type="button" aria-label="Archive or restore task">
              <Archive className="h-4 w-4" />
            </button>
            <button className="rounded-md border border-rose-200 p-2 text-rose-600 hover:bg-rose-50" onClick={handleDelete} type="button" aria-label="Delete task">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due date</dt>
            <dd className="mt-1 text-sm font-medium text-slate-700">{formatDate(task.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</dt>
            <dd className="mt-1 text-sm font-medium text-slate-700">{formatDate(task.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</dt>
            <dd className="mt-1 text-sm font-medium text-slate-700">{formatDate(task.updatedAt)}</dd>
          </div>
        </dl>
      </section>
    </section>
  );
}
