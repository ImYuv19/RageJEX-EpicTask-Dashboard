import { STATUS_COLORS } from "../../utils/constants.js";

export function Badge({ value, className = "" }) {
  const classes =
    STATUS_COLORS[value] ||
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes} ${className}`}
    >
      {value}
    </span>
  );
}
