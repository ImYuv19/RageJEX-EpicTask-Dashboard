import { AlertTriangle } from "lucide-react";
import { getRiskTasks } from "../../utils/risk.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function DeadlineRiskSorter({ tasks }) {
  const rankedTasks = getRiskTasks(tasks).filter((task) => task.riskScore > 0);

  return (
    <Card
      title="Deadline Risk Sorter"
      subtitle="Risk Score = Delay Days, ranked highest to lowest."
    >
      {rankedTasks.length ? (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {rankedTasks.slice(0, 3).map((task, index) => (
              <div
                key={task.id}
                className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-400/20 dark:bg-red-500/10"
              >
                <p className="text-xs font-black uppercase text-red-500">
                  Rank #{index + 1}
                </p>
                <h3 className="mt-2 font-bold text-slate-950 dark:text-white">
                  {task.title}
                </h3>
                <p className="mt-2 text-2xl font-black text-danger">
                  {task.riskScore}
                </p>
                <p className="text-sm font-semibold text-red-700 dark:text-red-100">
                  delayed days
                </p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[620px] w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {rankedTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="table-cell">#{index + 1}</td>
                    <td className="table-cell font-semibold">{task.title}</td>
                    <td className="table-cell">
                      <Badge value={task.priority} />
                    </td>
                    <td className="table-cell">
                      <Badge value={task.status} />
                    </td>
                    <td className="table-cell font-black text-danger">
                      {task.riskScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="No deadline risk"
          message="Tasks with delay days will appear in highest-risk order."
        />
      )}
    </Card>
  );
}
