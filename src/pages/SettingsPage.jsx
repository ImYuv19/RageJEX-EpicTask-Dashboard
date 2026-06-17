import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button.jsx";
import { Card } from "../components/common/Card.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ThemeSwitcher } from "../components/settings/ThemeSwitcher.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { isValidEmail } from "../utils/validators.js";

export function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();
  const { resetApplicationData } = useAppData();
  const { setTheme } = useTheme();
  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const updateField = (field, value) => {
    setProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
    setMessage("");
    setError("");
  };

  const saveProfile = (event) => {
    event.preventDefault();

    if (!profile.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!isValidEmail(profile.email)) {
      setError("Enter a valid email address.");
      return;
    }

    updateProfile(profile);
    setMessage("Profile information saved.");
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset projects, tasks, members, notifications, history, activities, and settings to seed data?"
    );

    if (!confirmed) return;
    setIsResetting(true);
    setTimeout(() => {
      resetApplicationData();
      setTheme("light");
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {isResetting ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur dark:bg-slate-950/80">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
            Resetting application data to seed state...
          </p>
        </div>
      ) : null}
      <PageHeader
        eyebrow="Settings Module"
        title="Settings"
        description="Manage theme preference, profile information, and LocalStorage demo data."
      />

      <Card title="Theme Switcher" subtitle="Choose Light, Dark, or System mode.">
        <ThemeSwitcher />
      </Card>

      <Card title="Profile Information" subtitle="LocalStorage-based user profile.">
        <form className="space-y-4" onSubmit={saveProfile}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="form-label" htmlFor="settings-name">
                Full Name
              </label>
              <input
                className="form-input"
                id="settings-name"
                value={profile.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="form-label" htmlFor="settings-email">
                Email
              </label>
              <input
                className="form-input"
                id="settings-email"
                type="email"
                value={profile.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          {message ? (
            <p className="text-sm font-semibold text-success">{message}</p>
          ) : null}
          <Button type="submit" icon={Save}>
            Save Profile
          </Button>
        </form>
      </Card>

      <Card
        title="Reset Application Data"
        subtitle="Restore the populated demo seed data in LocalStorage."
      >
        <div className="flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-100">
              Reset LocalStorage collections
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-100">
              Users and the active session are preserved; app collections return
              to the original demo state.
            </p>
          </div>
          <Button variant="warning" icon={RotateCcw} onClick={handleReset}>
            Reset Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
