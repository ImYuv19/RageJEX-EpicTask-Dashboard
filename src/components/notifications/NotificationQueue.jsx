import { Send } from "lucide-react";
import { getQueuedNotifications } from "../../utils/notifications.js";
import { Button } from "../common/Button.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";
import { NotificationCard } from "./NotificationCard.jsx";

export function NotificationQueue({ notifications, onSendNext }) {
  const queue = getQueuedNotifications(notifications);

  return (
    <Card
      title="Notification Queue"
      subtitle="Alert Organizer uses FIFO logic: first in, first out."
      actions={
        <Button
          variant="secondary"
          size="sm"
          icon={Send}
          disabled={!queue.length}
          onClick={onSendNext}
        >
          Send Next
        </Button>
      }
      bodyClassName="space-y-3"
    >
      {queue.length ? (
        queue.map((notification, index) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            queueIndex={index + 1}
          />
        ))
      ) : (
        <EmptyState
          title="Queue is empty"
          message="New task updates, deadline changes, and dependency alerts will line up here."
        />
      )}
    </Card>
  );
}
