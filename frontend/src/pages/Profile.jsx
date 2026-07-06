import { useForm } from 'react-hook-form';
import { Camera, LockKeyhole, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, updateLocalUser } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    }
  });

  function onSubmit(values) {
    updateLocalUser(values);
    showToast('Profile updated locally. Backend profile update endpoint can persist this next.', 'success');
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage identity details shown across the workspace.</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="md:w-56">
            <img className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200" src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'TaskFlow')}`} alt="" />
            <p className="mt-3 text-sm text-slate-500">Avatar URL is supported in this version.</p>
          </div>

          <form className="flex-1 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('name', { required: 'Name is required' })} />
            </label>
            {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}

            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="email" {...register('email', { required: 'Email is required' })} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Avatar URL
              <span className="relative mt-2 block">
                <Camera className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" {...register('avatar')} />
              </span>
            </label>

            <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" type="submit">
              <Save className="h-4 w-4" />
              Save profile
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-950">Change password</h2>
            <p className="text-sm text-slate-500">Password update UI is ready for the next backend account endpoint.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
