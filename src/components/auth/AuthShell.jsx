import logo from "../../assets/logo.svg";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-app-bg px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lift dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1fr_1.1fr]">
          <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <img className="h-12 w-12 rounded-lg" src={logo} alt="RageJEX" />
              <h1 className="mt-8 text-4xl font-black">RageJEX</h1>
              <p className="mt-3 text-lg font-semibold text-violet-200">
                EpicTask Dashboard
              </p>
              <p className="mt-6 max-w-md text-sm leading-6 text-slate-300">
                Plan. Track. Deliver. Monitor critical path, workloads, risk, and
                notification flow from one production-style SaaS dashboard.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["Projects", "Tasks", "Risk"].map((item) => (
                <div key={item} className="rounded-lg bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase text-violet-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <img className="h-10 w-10 rounded-lg" src={logo} alt="RageJEX" />
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">
                    RageJEX
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    EpicTask Dashboard
                  </p>
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
              <div className="mt-8">{children}</div>
              {footer ? <div className="mt-6">{footer}</div> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
