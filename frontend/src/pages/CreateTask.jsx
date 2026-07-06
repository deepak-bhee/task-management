import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TaskForm from '../components/TaskForm.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createTask } from '../services/taskService.js';

export default function CreateTask() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    setIsSubmitting(true);

    try {
      const payload = { ...values, dueDate: values.dueDate || undefined };
      const { task } = await createTask(payload);
      showToast('Task created.', 'success');
      navigate(`/tasks/${task._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to="/tasks">
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Create Task</h1>
        <p className="mt-1 text-sm text-slate-500">Capture the work clearly so future you knows exactly what to do.</p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <TaskForm isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Create task" />
      </section>
    </section>
  );
}
