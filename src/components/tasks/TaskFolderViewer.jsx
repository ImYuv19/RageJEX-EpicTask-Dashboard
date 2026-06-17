import { FolderKanban, ListTree } from "lucide-react";
import { formatDate } from "../../utils/date.js";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";

export function TaskFolderViewer({ projects, tasks }) {
  return (
    <Card
      title="Task Folder Viewer"
      subtitle="Project hierarchy with task owner, status, and deadline."
      bodyClassName="space-y-4"
    >
      {projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.projectId === project.id);

        return (
          <div
            key={project.id}
            className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
          >
            <div className="flex flex-wrap items-center gap-3">
              <FolderKanban className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-slate-950 dark:text-white">
                {project.name}
              </h3>
              <span className="text-sm font-semibold text-slate-500">
                {projectTasks.length} tasks
              </span>
            </div>
            <div className="mt-4 space-y-2 border-l border-slate-200 pl-4 dark:border-slate-700">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:grid-cols-[1.2fr_1fr_auto_auto]"
                >
                  <div className="flex items-center gap-2">
                    <ListTree className="h-4 w-4 text-slate-400" />
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {task.title}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {task.assignee}
                  </p>
                  <Badge value={task.status} />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {formatDate(task.deadline)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
