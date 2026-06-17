import { GitPullRequestArrow, Timer } from "lucide-react";
import { calculateCriticalPath } from "../../utils/criticalPath.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function CriticalPathCard({ tasks }) {
  const criticalPath = calculateCriticalPath(tasks);

  return (
    <Card
      title="Quickest Project Completion Finder"
      subtitle="Simplified critical path calculation using task durations and dependencies."
    >
      {criticalPath.path.length ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-5 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase text-primary">
                <Timer className="h-4 w-4" />
                Total Duration
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
                {criticalPath.totalDuration} days
              </p>
            </div>
            <Badge value="Approved" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {criticalPath.path.map((task, index) => (
              <div key={task.id} className="flex items-center gap-2">
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  {task.title}
                </span>
                {index < criticalPath.path.length - 1 ? (
                  <GitPullRequestArrow className="h-4 w-4 text-slate-400" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={GitPullRequestArrow}
          title="No critical path"
          message="Add dependencies between tasks to calculate the fastest completion chain."
        />
      )}
    </Card>
  );
}
