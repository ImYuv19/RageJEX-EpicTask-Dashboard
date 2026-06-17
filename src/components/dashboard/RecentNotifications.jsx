import { Bell } from "lucide-react";
import { getQueuedNotifications } from "../../utils/notifications.js";
import { formatDateTime } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function RecentNotifications({ notifications }) {
  const queue = getQueuedNotifications(notifications).slice(0, 5);

  return (
    <Card
      title="Recent Notifications"
      subtitle="FIFO queue order for teammate alerts."
      bodyClassName="space-y-3"
    >
      {queue.length ? (
        queue.map((notification, index) => (
          <div
            key={notification.id}
            className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-3">
              <Badge value={notification.type} />
              <span className="text-xs font-bold text-slate-400">
                Queue #{index + 1}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {notification.message}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {formatDateTime(notification.timestamp)}
            </p>
          </div>
        ))
      ) : (
        <EmptyState
          icon={Bell}
          title="Queue is clear"
          message="New task updates and risk alerts will appear here."
        />
      )}
    </Card>
  );
}
