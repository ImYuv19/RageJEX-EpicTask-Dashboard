import { LockKeyhole } from "lucide-react";
import { getBlockedTasks } from "../../utils/criticalPath.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function BlockedTaskList({ tasks }) {
  const blockedTasks = getBlockedTasks(tasks);

  return (
    <Card
      title="Blocked Tasks List"
      subtitle="Waiting tasks with their blocking dependency and current status."
    >
      {blockedTasks.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Blocking Task</th>
                <th className="px-4 py-3">Waiting Task</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3">Waiting Assignee</th>
              </tr>
            </thead>
            <tbody>
              {blockedTasks.map((item) => (
                <tr key={`${item.blockingTask.id}-${item.waitingTask.id}`}>
                  <td className="table-cell font-semibold">
                    {item.blockingTask.title}
                  </td>
                  <td className="table-cell font-semibold">
                    {item.waitingTask.title}
                  </td>
                  <td className="table-cell">
                    <Badge value={item.status} />
                  </td>
                  <td className="table-cell">{item.waitingTask.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={LockKeyhole}
          title="No blocked tasks"
          message="Blocked dependencies will be detected from each task's blockedBy field."
        />
      )}
    </Card>
  );
}
