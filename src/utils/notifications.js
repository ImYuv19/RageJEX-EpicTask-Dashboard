export function getQueuedNotifications(notifications) {
  return [...notifications]
    .filter((notification) => notification.status === "queued")
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function getNotificationHistory(notifications) {
  return [...notifications]
    .filter((notification) => notification.status === "sent")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
