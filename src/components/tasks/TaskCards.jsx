import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";

export function TaskCards({ tasks, projects, onEdit, onDelete }) {
  const projectName = (projectId) =>
    projects.find((project) => project.id === projectId)?.name || "Unassigned";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-950 dark:text-white">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {projectName(task.projectId)}
              </p>
            </div>
            <Badge value={task.priority} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase text-slate-400">Assignee</p>
              <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                {task.assignee}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase text-slate-400">Duration</p>
              <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                {task.duration} days
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CalendarClock className="h-4 w-4" />
            {formatDate(task.deadline)}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <Badge value={task.status} />
            <div className="flex gap-1">
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
          </div>
        </article>
      ))}
    </div>
  );
}
