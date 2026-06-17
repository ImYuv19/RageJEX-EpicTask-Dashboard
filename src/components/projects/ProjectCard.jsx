import { CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";

export function ProjectCard({ project, taskCount, onView, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-950 dark:text-white">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Lead: {project.owner}
          </p>
        </div>
        <Badge value={project.status} />
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {project.description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <CalendarDays className="h-4 w-4" />
        {formatDate(project.startDate)} - {formatDate(project.endDate)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(project.milestones || []).slice(0, 4).map((milestone) => (
          <span
            key={milestone}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {milestone}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {taskCount} tasks
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onView} aria-label="View project">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit project">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-danger hover:text-danger"
            onClick={onDelete}
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
