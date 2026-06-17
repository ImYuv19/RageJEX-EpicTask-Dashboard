import { CircleSlash, GitBranch, Route, Timer } from "lucide-react";
import { BlockedTaskList } from "../components/dependencies/BlockedTaskList.jsx";
import { CriticalPathCard } from "../components/dependencies/CriticalPathCard.jsx";
import { DependencyGraph } from "../components/dependencies/DependencyGraph.jsx";
import { TaskLockHub } from "../components/dependencies/TaskLockHub.jsx";
import { Card } from "../components/common/Card.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import {
  calculateCriticalPath,
  getBlockedTasks,
  getDependencyEdges,
} from "../utils/criticalPath.js";

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <Card bodyClassName="p-0">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-black text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function DependenciesPage() {
  const { tasks } = useAppData();
  const edges = getDependencyEdges(tasks);
  const blockedTasks = getBlockedTasks(tasks);
  const criticalPath = calculateCriticalPath(tasks);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dependencies Module"
        title="Dependencies"
        description="Dependency graph, critical path summary, blocked task list, and lock hub for delivery sequencing."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Dependency Edges"
          value={edges.length}
          icon={GitBranch}
          tone="bg-violet-50 text-primary dark:bg-violet-500/10"
        />
        <Stat
          label="Blocked Links"
          value={blockedTasks.length}
          icon={CircleSlash}
          tone="bg-red-50 text-danger dark:bg-red-500/10"
        />
        <Stat
          label="Critical Path Tasks"
          value={criticalPath.path.length}
          icon={Route}
          tone="bg-blue-50 text-secondary dark:bg-blue-500/10"
        />
        <Stat
          label="Fastest Duration"
          value={`${criticalPath.totalDuration}d`}
          icon={Timer}
          tone="bg-emerald-50 text-success dark:bg-emerald-500/10"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <CriticalPathCard tasks={tasks} />
        <DependencyGraph tasks={tasks} />
      </div>

      <TaskLockHub tasks={tasks} />
      <BlockedTaskList tasks={tasks} />
    </div>
  );
}
