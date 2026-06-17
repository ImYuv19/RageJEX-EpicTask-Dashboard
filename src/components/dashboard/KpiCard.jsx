import { ArrowUpRight } from "lucide-react";

const toneClasses = {
  primary: "bg-violet-50 text-primary dark:bg-violet-500/10",
  secondary: "bg-blue-50 text-secondary dark:bg-blue-500/10",
  success: "bg-emerald-50 text-success dark:bg-emerald-500/10",
  warning: "bg-amber-50 text-warning dark:bg-amber-500/10",
  danger: "bg-red-50 text-danger dark:bg-red-500/10",
};

export function KpiCard({ label, value, icon: Icon, tone = "primary", helper }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClasses[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
        {helper}
      </p>
    </section>
  );
}
