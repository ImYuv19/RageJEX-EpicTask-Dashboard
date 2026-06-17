import { useMemo } from "react";
import { TASK_STATUSES } from "../utils/constants.js";
import { isOverdue } from "../utils/date.js";
import { getTopRiskTasks } from "../utils/risk.js";
import { getMembersWithWorkload } from "../utils/workload.js";

export function useMetrics({ projects, tasks, members, notifications }) {
  return useMemo(() => {
    const statusDistribution = TASK_STATUSES.map((status) => ({
      name: status,
      value: tasks.filter((task) => task.status === status).length,
    }));

    const workloadDistribution = getMembersWithWorkload(members, tasks).map(
      (member) => ({
        name: member.name,
        tasks: member.totalTasks,
        active: member.activeTasks,
      })
    );

    const riskDistribution = getTopRiskTasks(tasks, 6).map((task) => ({
      name: task.title,
      risk: task.riskScore,
    }));

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      activeTasks: tasks.filter((task) => task.status === "In Progress").length,
      blockedTasks: tasks.filter((task) => task.status === "Blocked").length,
      overdueTasks: tasks.filter(isOverdue).length,
      queuedNotifications: notifications.filter(
        (notification) => notification.status === "queued"
      ).length,
      statusDistribution,
      workloadDistribution,
      riskDistribution,
    };
  }, [members, notifications, projects, tasks]);
}
