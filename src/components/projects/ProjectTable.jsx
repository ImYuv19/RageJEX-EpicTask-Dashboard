import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";

export function ProjectTable({ projects, tasks, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-[760px] w-full">
        <thead className="table-head">
          <tr>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Timeline</th>
            <th className="px-4 py-3">Tasks</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="table-cell">
                <p className="font-bold text-slate-950 dark:text-white">
                  {project.name}
                </p>
                <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                  {project.description}
                </p>
              </td>
              <td className="table-cell">{project.owner}</td>
              <td className="table-cell">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </td>
              <td className="table-cell">
                {tasks.filter((task) => task.projectId === project.id).length}
              </td>
              <td className="table-cell">
                <Badge value={project.status} />
              </td>
              <td className="table-cell">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(project)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-danger hover:text-danger"
                    onClick={() => onDelete(project.id)}
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
