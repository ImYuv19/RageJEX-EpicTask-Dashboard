import { History } from "lucide-react";
import { getNotificationHistory } from "../../utils/notifications.js";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";
import { NotificationCard } from "./NotificationCard.jsx";

export function NotificationHistory({ notifications }) {
  const history = getNotificationHistory(notifications);

  return (
    <Card
      title="Notification History"
      subtitle="Alerts already sent to teammates."
      bodyClassName="space-y-3"
    >
      {history.length ? (
        history.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))
      ) : (
        <EmptyState
          icon={History}
          title="No history yet"
          message="Use Send Next to move queue items into history."
        />
      )}
    </Card>
  );
}
