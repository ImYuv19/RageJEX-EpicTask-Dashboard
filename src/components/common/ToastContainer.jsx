import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X, Zap } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { Button } from "./Button.jsx";

const icons = {
  success: CheckCircle2,
  warning: Zap,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100",
};

function Toast({ toast, onDismiss }) {
  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4200);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.id]);

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-soft ${colors[toast.type] || colors.info}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="min-w-0 flex-1 text-sm font-medium">{toast.message}</p>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-current hover:bg-white/40"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useAppData();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
