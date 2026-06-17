import { Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { Modal } from "../components/common/Modal.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { Skeleton } from "../components/common/Skeleton.jsx";
import { ProjectCard } from "../components/projects/ProjectCard.jsx";
import { ProjectForm } from "../components/projects/ProjectForm.jsx";
import { ProjectTable } from "../components/projects/ProjectTable.jsx";
import { ProjectTreeView } from "../components/projects/ProjectTreeView.jsx";
import { TaskFolderViewer } from "../components/tasks/TaskFolderViewer.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { formatDate } from "../utils/date.js";

const views = ["Cards", "Table", "Tree"];

function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsPage() {
  const {
    projects,
    tasks,
    createProject,
    updateProject,
    deleteProject,
    search,
  } = useAppData();
  const [view, setView] = useState("Cards");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter(
      (project) =>
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term)
    );
  }, [projects, search]);

  const closeModal = () => setModal(null);

  const handleDelete = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    const confirmed = window.confirm(
      `Delete ${project?.name || "this project"} and its tasks?`
    );

    if (confirmed) deleteProject(projectId);
  };

  const selectedProject =
    modal?.type === "view" || modal?.type === "edit" ? modal.project : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects Module"
        title="Projects"
        description="Create, edit, delete, view, validate templates, and inspect task hierarchy by project."
        actions={
          <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
            Create Project
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {views.map((item) => (
          <Button
            key={item}
            variant={view === item ? "primary" : "outline"}
            size="sm"
            onClick={() => setView(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {loading ? (
        <ProjectsSkeleton />
      ) : (
        <>
          {!projects.length ? (
            <EmptyState
              title="No projects"
              message="Create a project to begin organizing tasks and milestones."
              action={
                <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
                  Create Project
                </Button>
              }
            />
          ) : projects.length && !filteredProjects.length ? (
            <EmptyState
              title="No matching projects"
              message="Adjust your search query or create a new project."
              action={
                <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
                  Create Project
                </Button>
              }
            />
          ) : null}

          {view === "Cards" && filteredProjects.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={tasks.filter((task) => task.projectId === project.id).length}
                  onView={() => setModal({ type: "view", project })}
                  onEdit={() => setModal({ type: "edit", project })}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          ) : null}

          {view === "Table" && filteredProjects.length ? (
            <ProjectTable
              projects={filteredProjects}
              tasks={tasks}
              onView={(project) => setModal({ type: "view", project })}
              onEdit={(project) => setModal({ type: "edit", project })}
              onDelete={handleDelete}
            />
          ) : null}

          {view === "Tree" && filteredProjects.length ? (
            <div className="space-y-6">
              <ProjectTreeView projects={filteredProjects} tasks={tasks} />
              <TaskFolderViewer projects={filteredProjects} tasks={tasks} />
            </div>
          ) : null}
        </>
      )}

      <Modal
        open={modal?.type === "create"}
        title="Create Project"
        description="Template Checker validates required company setup fields before saving."
        onClose={closeModal}
      >
        <ProjectForm onSubmit={createProject} onCancel={closeModal} />
      </Modal>

      <Modal
        open={modal?.type === "edit"}
        title="Edit Project"
        description="Update project details while keeping template validation active."
        onClose={closeModal}
      >
        {selectedProject ? (
          <ProjectForm
            project={selectedProject}
            onSubmit={(values) => updateProject(selectedProject.id, values)}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>

      <Modal
        open={modal?.type === "view"}
        title={selectedProject?.name || "Project Details"}
        description="Project model, milestones, status, and linked tasks."
        onClose={closeModal}
      >
        {selectedProject ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Team Lead
                </p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">
                  {selectedProject.owner}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Timeline
                </p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">
                  {formatDate(selectedProject.startDate)} -{" "}
                  {formatDate(selectedProject.endDate)}
                </p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {selectedProject.description}
            </p>
            <div>
              <p className="mb-2 text-sm font-bold text-slate-950 dark:text-white">
                Milestones
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.milestones || []).map((milestone) => (
                  <span
                    key={milestone}
                    className="rounded-full bg-violet-50 px-3 py-1.5 text-sm font-bold text-primary dark:bg-violet-500/10"
                  >
                    {milestone}
                  </span>
                ))}
              </div>
            </div>
            <TaskFolderViewer
              projects={[selectedProject]}
              tasks={tasks.filter((task) => task.projectId === selectedProject.id)}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
