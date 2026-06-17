import { ChevronRight, FolderKanban } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Card } from "../common/Card.jsx";

export function ProjectTreeView({ projects, tasks }) {
  return (
    <Card
      title="Project Tree View"
      subtitle="Hierarchy of projects, milestones, and linked task counts."
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
              <p className="font-bold text-slate-950 dark:text-white">
                {project.name}
              </p>
              <Badge value={project.status} />
              <span className="text-sm font-semibold text-slate-500">
                {projectTasks.length} tasks
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(project.milestones || []).map((milestone) => (
                <div
                  key={milestone}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  {milestone}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
