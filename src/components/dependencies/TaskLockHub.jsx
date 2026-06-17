import { ArrowDown, LockKeyhole } from "lucide-react";
import { calculateCriticalPath, getBlockedTasks } from "../../utils/criticalPath.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function TaskLockHub({ tasks }) {
  const blockedTasks = getBlockedTasks(tasks);
  const criticalPath = calculateCriticalPath(tasks);

  return (
    <Card
      title="Task Lock Hub"
      subtitle="Central view of tasks that are blocked or waiting on dependencies."
    >
      {blockedTasks.length ? (
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            {blockedTasks.slice(0, 6).map((item) => (
              <div
                key={`${item.blockingTask.id}-${item.waitingTask.id}`}
                className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
              >
                <p className="text-xs font-bold uppercase text-slate-400">
                  Blocking Task
                </p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">
                  {item.blockingTask.title}
                </p>
                <ArrowDown className="my-3 h-5 w-5 text-primary" />
                <p className="text-xs font-bold uppercase text-slate-400">
                  Waiting Task
                </p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">
                  {item.waitingTask.title}
                </p>
                <div className="mt-3">
                  <Badge value={item.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Dependency Chain
            </p>
            <div className="flex flex-col items-start gap-2">
              {criticalPath.path.map((task, index) => (
                <div key={task.id}>
                  <div className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-700">
                    {task.title}
                  </div>
                  {index < criticalPath.path.length - 1 ? (
                    <ArrowDown className="ml-4 mt-2 h-5 w-5 text-primary" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={LockKeyhole}
          title="No locked tasks"
          message="Tasks with dependencies or blocked status will appear here."
        />
      )}
    </Card>
  );
}
