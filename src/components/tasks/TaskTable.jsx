import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";

export function TaskTable({ tasks, projects, onEdit, onDelete }) {
  const projectName = (projectId) =>
    projects.find((project) => project.id === projectId)?.name || "Unassigned";

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-[920px] w-full">
        <thead className="table-head">
          <tr>
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="table-cell">
                <p className="font-bold text-slate-950 dark:text-white">
                  {task.title}
                </p>
                {task.blockedBy?.length ? (
                  <p className="mt-1 text-xs text-danger">
                    Waiting on {task.blockedBy.length} task(s)
                  </p>
                ) : null}
              </td>
              <td className="table-cell">{projectName(task.projectId)}</td>
              <td className="table-cell">{task.assignee}</td>
              <td className="table-cell">{task.duration} days</td>
              <td className="table-cell">{formatDate(task.deadline)}</td>
              <td className="table-cell">{task.delayDays} days</td>
              <td className="table-cell">
                <Badge value={task.status} />
              </td>
              <td className="table-cell">
                <Badge value={task.priority} />
              </td>
              <td className="table-cell">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-danger hover:text-danger"
                    onClick={() => onDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
