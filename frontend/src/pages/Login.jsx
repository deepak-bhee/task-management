import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values) {
    setIsSubmitting(true);

    try {
      await login(values);
      showToast('Welcome back. Your workspace is ready.', 'success');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to sign in.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-10 md:grid-cols-[1fr_460px] md:p-0">
      <section className="hidden items-center bg-slate-950 px-12 text-white md:flex">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">TaskFlow</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">Return to a calmer command center for your work.</h1>
          <p className="mt-5 text-lg text-slate-300">Track deadlines, filter priorities, and keep your next move visible.</p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <form className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use your TaskFlow account to continue.</p>

          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Email
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="email" {...register('email', { required: 'Email is required' })} />
          </label>
          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Password
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="password" {...register('password', { required: 'Password is required' })} />
          </label>
          {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60" disabled={isSubmitting} type="submit">
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            New here? <Link className="font-semibold text-indigo-700 hover:text-indigo-800" to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
