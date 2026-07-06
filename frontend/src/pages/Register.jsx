import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, register: registerAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values) {
    setIsSubmitting(true);

    try {
      await registerAccount(values);
      showToast('Account created. Welcome to TaskFlow.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to create account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-10 md:grid-cols-[1fr_460px] md:p-0">
      <section className="hidden items-center bg-indigo-700 px-12 text-white md:flex">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">TaskFlow</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">Build a personal operating system for every deadline.</h1>
          <p className="mt-5 text-lg text-indigo-100">Create, filter, prioritize, and finish tasks from one focused workspace.</p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <form className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold text-slate-950">Create account</h2>
          <p className="mt-2 text-sm text-slate-500">Start organizing your tasks in a few seconds.</p>

          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Name
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Use at least 2 characters' } })} />
          </label>
          {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p> : null}

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Email
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="email" {...register('email', { required: 'Email is required' })} />
          </label>
          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Password
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
          </label>
          {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60" disabled={isSubmitting} type="submit">
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account? <Link className="font-semibold text-indigo-700 hover:text-indigo-800" to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
