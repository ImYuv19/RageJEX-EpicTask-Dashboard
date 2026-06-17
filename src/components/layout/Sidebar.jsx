import {
  Bell,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronLeft,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { Button } from "../common/Button.jsx";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: BriefcaseBusiness },
  { label: "Tasks", path: "/tasks", icon: ListChecks },
  { label: "Dependencies", path: "/dependencies", icon: GitBranch },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Workload", path: "/workload", icon: ChartNoAxesCombined },
  { label: "Settings", path: "/settings", icon: Settings },
];

function Navigation({ collapsed = false, onNavigate }) {
  return (
    <nav className="mt-6 space-y-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            } ${collapsed ? "justify-center" : ""}`
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed ? <span>{item.label}</span> : null}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-950 md:flex md:flex-col ${
          collapsed ? "md:w-20" : "md:w-72"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img className="h-9 w-9 rounded-lg" src={logo} alt="RageJEX" />
            {!collapsed ? (
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  RageJEX
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  EpicTask
                </p>
              </div>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Navigation collapsed={collapsed} />
        {!collapsed ? (
          <div className="mt-auto p-4">
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-primary">
                Plan. Track. Deliver.
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Critical path, workload, risk, and alerts in one control panel.
              </p>
            </div>
          </div>
        ) : null}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close navigation"
            type="button"
            onClick={onCloseMobile}
          />
          <aside className="relative flex h-full w-80 max-w-[86vw] flex-col border-r border-slate-200 bg-white shadow-lift dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img className="h-9 w-9 rounded-lg" src={logo} alt="RageJEX" />
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">
                    RageJEX
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    EpicTask
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCloseMobile}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Navigation onNavigate={onCloseMobile} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
