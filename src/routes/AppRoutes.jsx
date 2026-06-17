import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { DependenciesPage } from "../pages/DependenciesPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { NotificationsPage } from "../pages/NotificationsPage.jsx";
import { ProjectsPage } from "../pages/ProjectsPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";
import { SignupPage } from "../pages/SignupPage.jsx";
import { TasksPage } from "../pages/TasksPage.jsx";
import { WorkloadPage } from "../pages/WorkloadPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/dependencies" element={<DependenciesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/workload" element={<WorkloadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
