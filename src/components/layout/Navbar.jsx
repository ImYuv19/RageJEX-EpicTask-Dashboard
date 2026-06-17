import { LogOut, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { Button } from "../common/Button.jsx";

const titles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/dependencies": "Dependencies",
  "/notifications": "Notifications",
  "/workload": "Workload",
  "/settings": "Settings",
};

export function Navbar({ onOpenMobile }) {
  const { search, setSearch } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const pageTitle = useMemo(() => titles[pathname] || "EpicTask", [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-950 dark:text-white">
            {pageTitle}
          </p>
        </div>
        <div className="ml-auto hidden w-full max-w-md items-center sm:flex">
          <label className="relative w-full">
            <span className="sr-only">Search dashboard</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="form-input h-10 pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, tasks, owners"
              type="search"
            />
          </label>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          title={`Theme: ${theme}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        <div className="relative">
          <Button
            variant="outline"
            className="max-w-[11rem] px-3"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            <UserRound className="h-4 w-4 shrink-0" />
            <span className="hidden truncate text-left sm:block">
              {currentUser?.fullName || "User"}
            </span>
          </Button>
          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-800 dark:bg-slate-900">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                  {currentUser?.fullName}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {currentUser?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-danger hover:text-danger"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
