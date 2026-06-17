import { GitBranch } from "lucide-react";
import { calculateCriticalPath } from "../../utils/criticalPath.js";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function CriticalPathSummary({ tasks }) {
  const criticalPath = calculateCriticalPath(tasks);

  return (
    <Card
      title="Critical Path Summary"
      subtitle="Quickest completion finder output based on dependencies."
    >
      {criticalPath.path.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Duration
              </p>
              <p className="text-3xl font-black text-slate-950 dark:text-white">
                {criticalPath.totalDuration} days
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 text-primary dark:bg-violet-500/10">
              <GitBranch className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {criticalPath.chain.map((task, index) => (
              <div key={`${task}-${index}`} className="flex items-center gap-2">
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-700">
                  {task}
                </span>
                {index < criticalPath.chain.length - 1 ? (
                  <span className="text-slate-400">-&gt;</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={GitBranch}
          title="No critical path"
          message="Create dependent tasks to calculate a completion path."
        />
      )}
    </Card>
  );
}
