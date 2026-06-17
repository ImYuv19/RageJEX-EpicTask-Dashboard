import { Inbox } from "lucide-react";

export function EmptyState({ title, message, icon: Icon = Inbox, action }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-950">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
