import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CheckSquare,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'My Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings }
];

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    showToast('You have been logged out.', 'success');
    navigate('/login');
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <NavLink className="flex items-center gap-3" to="/dashboard" onClick={() => setIsOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">TF</span>
          <span>
            <span className="block text-sm font-bold text-slate-950">TaskFlow</span>
            <span className="block text-xs text-slate-500">Productivity OS</span>
          </span>
        </NavLink>
        <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={() => setIsOpen(false)} type="button" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <NavLink className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" to="/tasks/new" onClick={() => setIsOpen(false)}>
          <Plus className="h-4 w-4" />
          New task
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
              to={item.to}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex min-w-0 items-center gap-3">
          <img className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200" src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'TaskFlow')}`} alt="" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{user?.name || 'TaskFlow User'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" onClick={handleLogout} type="button">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="hidden fixed inset-y-0 left-0 z-30 md:block">{sidebar}</div>
      {isOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={() => setIsOpen(false)} type="button" aria-label="Close navigation overlay" />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}
      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setIsOpen(true)} type="button" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-slate-500">Welcome back</p>
            <p className="text-base font-semibold text-slate-950">{user?.name || 'TaskFlow User'}</p>
          </div>
          <NavLink className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" to="/tasks/new">
            <Plus className="h-4 w-4" />
            Add task
          </NavLink>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
