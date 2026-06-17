import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { Button } from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = signup(values);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Sign up with local demo authentication. No backend or API is used."
      footer={
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link className="font-bold text-primary hover:text-violet-700" to="/auth/login">
            Login
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="form-input"
            id="fullName"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Aarav Mehta"
          />
          {errors.fullName ? <p className="form-error">{errors.fullName}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="signup-email">
            Email
          </label>
          <input
            className="form-input"
            id="signup-email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@company.com"
          />
          {errors.email ? <p className="form-error">{errors.email}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="form-label" htmlFor="signup-password">
              Password
            </label>
            <input
              className="form-input"
              id="signup-password"
              type="password"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="At least 8 characters"
            />
            {errors.password ? (
              <p className="form-error">{errors.password}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="form-input"
              id="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              placeholder="Repeat password"
            />
            {errors.confirmPassword ? (
              <p className="form-error">{errors.confirmPassword}</p>
            ) : null}
          </div>
        </div>
        <Button className="w-full" type="submit" icon={UserPlus}>
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
