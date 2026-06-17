import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {themes.map((item) => {
        const Icon = item.icon;
        const active = theme === item.value;

        return (
          <button
            key={item.value}
            className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
              active
                ? "border-primary bg-violet-50 text-primary dark:bg-violet-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
            type="button"
            onClick={() => setTheme(item.value)}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className="font-bold">{item.label}</span>
            </span>
            {active ? <Check className="h-5 w-5" /> : null}
          </button>
        );
      })}
    </div>
  );
}
