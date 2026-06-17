export function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white shadow-soft transition hover:shadow-lift dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {(title || subtitle || actions) && (
        <header className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
