import { Clock3 } from "lucide-react";
import { formatDateTime } from "../../utils/date.js";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function ActivityFeed({ activities }) {
  return (
    <Card
      title="Activity Feed"
      subtitle="Recent actions across projects, dependencies, and schedules."
      bodyClassName="space-y-4"
    >
      {activities.length ? (
        activities.slice(0, 8).map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-primary dark:bg-violet-500/10">
              <Clock3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-950 dark:text-white">
                {activity.label}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {activity.detail}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {formatDateTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          title="No activities yet"
          message="Create projects or update tasks to populate the feed."
        />
      )}
    </Card>
  );
}
