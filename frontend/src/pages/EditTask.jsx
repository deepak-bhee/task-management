import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import TaskForm from '../components/TaskForm.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getTask, updateTask } from '../services/taskService.js';

export default function EditTask() {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getTask(id)
      .then(({ task: item }) => setTask(item))
      .catch((error) => showToast(error.response?.data?.message || 'Unable to load task.', 'error'))
      .finally(() => setIsLoading(false));
  }, [id, showToast]);

  async function handleSubmit(values) {
    setIsSubmitting(true);

    try {
      const payload = { ...values, dueDate: values.dueDate || undefined };
      const { task: updatedTask } = await updateTask(id, payload);
      showToast('Task updated.', 'success');
      navigate(`/tasks/${updatedTask._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="grid min-h-72 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to={`/tasks/${id}`}>
        <ArrowLeft className="h-4 w-4" />
        Back to task
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Edit Task</h1>
        <p className="mt-1 text-sm text-slate-500">Adjust the task as the work becomes clearer.</p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <TaskForm initialTask={task} isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Save changes" />
      </section>
    </section>
  );
}
