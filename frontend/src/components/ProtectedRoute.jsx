import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
