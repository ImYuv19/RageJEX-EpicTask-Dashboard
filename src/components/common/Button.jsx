const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-violet-700 active:bg-violet-800",
  secondary:
    "bg-secondary text-white shadow-sm hover:bg-blue-600 active:bg-blue-700",
  success:
    "bg-success text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700",
  danger: "bg-danger text-white shadow-sm hover:bg-red-600 active:bg-red-700",
  warning:
    "bg-warning text-white shadow-sm hover:bg-amber-600 active:bg-amber-700",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
};

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
