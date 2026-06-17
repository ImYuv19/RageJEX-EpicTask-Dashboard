import { AlertCircle, CheckCircle2, Info, Zap } from "lucide-react";
import { formatDateTime } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";

const icons = {
  success: CheckCircle2,
  warning: Zap,
  error: AlertCircle,
  info: Info,
};

export function NotificationCard({ notification, queueIndex }) {
  const Icon = icons[notification.type] || Info;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-primary dark:bg-slate-800">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge value={notification.type} />
            {queueIndex ? (
              <span className="text-xs font-bold text-slate-400">
                Queue #{queueIndex}
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
            {notification.message}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            {formatDateTime(notification.timestamp)}
          </p>
        </div>
      </div>
    </article>
  );
}
