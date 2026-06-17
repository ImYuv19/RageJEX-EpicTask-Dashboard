import { BellPlus } from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { Card } from "../components/common/Card.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { NotificationHistory } from "../components/notifications/NotificationHistory.jsx";
import { NotificationQueue } from "../components/notifications/NotificationQueue.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { NOTIFICATION_TYPES } from "../utils/constants.js";
import {
  getNotificationHistory,
  getQueuedNotifications,
} from "../utils/notifications.js";

export function NotificationsPage() {
  const {
    notifications,
    enqueueNotification,
    dequeueNotification,
  } = useAppData();
  const queue = getQueuedNotifications(notifications);
  const history = getNotificationHistory(notifications);

  const addSampleAlert = () => {
    const type = NOTIFICATION_TYPES[notifications.length % NOTIFICATION_TYPES.length];
    enqueueNotification({
      type,
      message: `Manual ${type} alert added to the FIFO queue.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alert Organizer"
        title="Notifications"
        description="FIFO notification queue, sent history, and modern cards for success, warning, error, and info alerts."
        actions={
          <Button icon={BellPlus} onClick={addSampleAlert}>
            Add Alert
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Card>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Queue Size
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
            {queue.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            History
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
            {history.length}
          </p>
        </Card>
        {NOTIFICATION_TYPES.map((type) => (
          <Card key={type}>
            <p className="text-sm font-semibold capitalize text-slate-500 dark:text-slate-400">
              {type} Alerts
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              {notifications.filter((item) => item.type === type).length}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <NotificationQueue
          notifications={notifications}
          onSendNext={dequeueNotification}
        />
        <NotificationHistory notifications={notifications} />
      </div>
    </div>
  );
}
