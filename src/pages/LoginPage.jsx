import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { Button } from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [values, setValues] = useState({
    email: "demo@ragejex.com",
    password: "password123",
  });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(values);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage projects, tasks, dependencies, and team workload."
      footer={
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to RageJEX?{" "}
          <Link className="font-bold text-primary hover:text-violet-700" to="/auth/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@company.com"
          />
          {errors.email ? <p className="form-error">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            id="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Minimum 8 characters"
          />
          {errors.password ? <p className="form-error">{errors.password}</p> : null}
        </div>
        <div className="rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm text-violet-800 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-100">
          Demo login: demo@ragejex.com / password123
        </div>
        <Button className="w-full" type="submit" icon={LogIn}>
          Login
        </Button>
      </form>
    </AuthShell>
  );
}
