import { ArrowRight, GitBranch } from "lucide-react";
import {
  calculateCriticalPath,
  getDependencyEdges,
  getTaskMap,
} from "../../utils/criticalPath.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function DependencyGraph({ tasks }) {
  const taskMap = getTaskMap(tasks);
  const edges = getDependencyEdges(tasks);
  const criticalPath = calculateCriticalPath(tasks);

  return (
    <Card
      title="Dependency Graph"
      subtitle="Dependency visualization from blockedBy task relationships."
    >
      {edges.length ? (
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Critical Path Visualization
            </p>
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              {criticalPath.path.map((task, index) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
                    <p className="font-bold text-slate-950 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {task.duration} days
                    </p>
                  </div>
                  {index < criticalPath.path.length - 1 ? (
                    <ArrowRight className="h-5 w-5 text-primary" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {edges.map((edge) => {
              const from = taskMap.get(edge.from);
              const to = taskMap.get(edge.to);

              if (!from || !to) return null;

              return (
                <div
                  key={`${edge.from}-${edge.to}`}
                  className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <p className="min-w-0 flex-1 truncate font-bold text-slate-950 dark:text-white">
                      {from.title} blocks {to.title}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge value={from.status} />
                    <Badge value={to.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={GitBranch}
          title="No dependency edges"
          message="Select blocked-by tasks to build the dependency graph."
        />
      )}
    </Card>
  );
}
