import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;

          return (
            <div key={toast.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-xl shadow-slate-950/10">
              <Icon className={toast.type === 'error' ? 'mt-0.5 h-5 w-5 text-rose-600' : 'mt-0.5 h-5 w-5 text-emerald-600'} />
              <p className="flex-1 text-slate-700">{toast.message}</p>
              <button className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => removeToast(toast.id)} type="button" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
