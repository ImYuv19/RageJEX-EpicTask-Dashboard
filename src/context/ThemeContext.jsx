import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { initializeStorage, STORAGE_KEYS } from "../services/storageService.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  initializeStorage();
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, {
    theme: "light",
  });

  const theme = settings.theme || "light";

  useEffect(() => {
    const applyTheme = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);

      document.documentElement.classList.toggle("dark", shouldUseDark);
      document.documentElement.dataset.theme = theme;
    };

    applyTheme();
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", applyTheme);

    return () => query.removeEventListener("change", applyTheme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      settings,
      setTheme: (nextTheme) =>
        setSettings((currentSettings) => ({
          ...currentSettings,
          theme: nextTheme,
        })),
      cycleTheme: () =>
        setSettings((currentSettings) => {
          const order = ["light", "dark", "system"];
          const index = order.indexOf(currentSettings.theme || "light");
          return {
            ...currentSettings,
            theme: order[(index + 1) % order.length],
          };
        }),
    }),
    [setSettings, settings, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}
