import { Grid2X2, List, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { Modal } from "../components/common/Modal.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { SearchInput } from "../components/common/SearchInput.jsx";
import { Skeleton } from "../components/common/Skeleton.jsx";
import { DeadlineRiskSorter } from "../components/tasks/DeadlineRiskSorter.jsx";
import { ScheduleHistoryPanel } from "../components/tasks/ScheduleHistoryPanel.jsx";
import { TaskCards } from "../components/tasks/TaskCards.jsx";
import { TaskFolderViewer } from "../components/tasks/TaskFolderViewer.jsx";
import { TaskForm } from "../components/tasks/TaskForm.jsx";
import { TaskTable } from "../components/tasks/TaskTable.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useTaskFilters } from "../hooks/useTaskFilters.js";
import { PRIORITIES, TASK_STATUSES } from "../utils/constants.js";

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TasksPage() {
  const { projects, tasks, createTask, updateTask, deleteTask } = useAppData();
  const filters = useTaskFilters(tasks);
  const [view, setView] = useState("Table");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setModal(null);

  const handleDelete = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    const confirmed = window.confirm(`Delete ${task?.title || "this task"}?`);
    if (confirmed) deleteTask(taskId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks Module"
        title="Tasks"
        description="Create, edit, delete, search, filter, sort, and manage schedule history for all tasks."
        actions={
          <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
            Create Task
          </Button>
        }
      />

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <SearchInput
          value={filters.search}
          onChange={filters.setSearch}
          placeholder="Search tasks or assignees"
        />
        <select
          className="form-input"
          value={filters.status}
          onChange={(event) => filters.setStatus(event.target.value)}
        >
          <option value="All">All Statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={filters.priority}
          onChange={(event) => filters.setPriority(event.target.value)}
        >
          <option value="All">All Priorities</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={filters.sortBy}
          onChange={(event) => filters.setSortBy(event.target.value)}
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="risk">Sort by Risk</option>
          <option value="duration">Sort by Duration</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <div className="flex gap-2">
          <Button
            variant={view === "Table" ? "primary" : "outline"}
            size="icon"
            onClick={() => setView("Table")}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "Cards" ? "primary" : "outline"}
            size="icon"
            onClick={() => setView("Cards")}
            aria-label="Card view"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <TasksSkeleton />
      ) : (
        <>
          {!filters.filteredTasks.length ? (
            <EmptyState
              title="No matching tasks"
              message="Adjust the search or filters, or create a new task."
              action={
                <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
                  Create Task
                </Button>
              }
            />
          ) : view === "Table" ? (
            <TaskTable
              tasks={filters.filteredTasks}
              projects={projects}
              onEdit={(task) => setModal({ type: "edit", task })}
              onDelete={handleDelete}
            />
          ) : (
            <TaskCards
              tasks={filters.filteredTasks}
              projects={projects}
              onEdit={(task) => setModal({ type: "edit", task })}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ScheduleHistoryPanel />
        <DeadlineRiskSorter tasks={tasks} />
      </div>

      <TaskFolderViewer projects={projects} tasks={tasks} />

      <Modal
        open={modal?.type === "create"}
        title="Create Task"
        description="New tasks can be auto-assigned to the member with the lowest workload."
        onClose={closeModal}
      >
        <TaskForm onSubmit={createTask} onCancel={closeModal} />
      </Modal>

      <Modal
        open={modal?.type === "edit"}
        title="Edit Task"
        description="Changing duration records a schedule history entry for undo and redo."
        onClose={closeModal}
      >
        {modal?.task ? (
          <TaskForm
            task={modal.task}
            onSubmit={(values) => updateTask(modal.task.id, values)}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>
    </div>
  );
}
