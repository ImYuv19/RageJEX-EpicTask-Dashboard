import { useState } from "react";
import { Wand2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { PRIORITIES, TASK_STATUSES } from "../../utils/constants.js";
import { hasDependencyCycle } from "../../utils/validators.js";
import { Button } from "../common/Button.jsx";
import { Badge } from "../common/Badge.jsx";

export function TaskForm({ task, onSubmit, onCancel }) {
  const { projects, tasks, members, suggestedAssignee } = useAppData();
  const [values, setValues] = useState({
    title: task?.title || "",
    projectId: task?.projectId || projects[0]?.id || "",
    assignee: task?.assignee || suggestedAssignee?.name || "",
    duration: task?.duration || 1,
    status: task?.status || "Todo",
    priority: task?.priority || "Medium",
    deadline: task?.deadline || "",
    delayDays: task?.delayDays || 0,
    blockedBy: task?.blockedBy || [],
  });
  const [errors, setErrors] = useState({});

  const availableDependencies = tasks.filter((item) => item.id !== task?.id);

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  };

  const toggleDependency = (taskId) => {
    setValues((currentValues) => {
      const selected = currentValues.blockedBy.includes(taskId);
      return {
        ...currentValues,
        blockedBy: selected
          ? currentValues.blockedBy.filter((id) => id !== taskId)
          : [...currentValues.blockedBy, taskId],
      };
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Task title is required.";
    if (!values.projectId) nextErrors.projectId = "Project is required.";
    if (!values.deadline) nextErrors.deadline = "Deadline is required.";
    if (Number(values.duration) < 1) {
      nextErrors.duration = "Duration must be at least 1 day.";
    }
    if (hasDependencyCycle(task?.id || "new-task", values.blockedBy, tasks)) {
      nextErrors.blockedBy =
        "Circular dependency detected! This task cannot depend on tasks that directly or indirectly depend on it.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(values);
    onCancel();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {suggestedAssignee ? (
        <div className="flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-500/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
              Suggested Assignee
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
              {suggestedAssignee.name} has the lowest active workload.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Wand2}
            onClick={() => updateField("assignee", suggestedAssignee.name)}
          >
            Use Suggestion
          </Button>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-title">
            Task Title
          </label>
          <input
            className="form-input"
            id="task-title"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Frontend"
          />
          {errors.title ? <p className="form-error">{errors.title}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-project">
            Project
          </label>
          <select
            className="form-input"
            id="task-project"
            value={values.projectId}
            onChange={(event) => updateField("projectId", event.target.value)}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId ? (
            <p className="form-error">{errors.projectId}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-assignee">
            Assignee
          </label>
          <select
            className="form-input"
            id="task-assignee"
            value={values.assignee}
            onChange={(event) => updateField("assignee", event.target.value)}
          >
            <option value="">Auto assign</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-duration">
            Duration
          </label>
          <input
            className="form-input"
            id="task-duration"
            type="number"
            min="1"
            value={values.duration}
            onChange={(event) => updateField("duration", event.target.value)}
          />
          {errors.duration ? <p className="form-error">{errors.duration}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-status">
            Status
          </label>
          <select
            className="form-input"
            id="task-status"
            value={values.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-priority">
            Priority
          </label>
          <select
            className="form-input"
            id="task-priority"
            value={values.priority}
            onChange={(event) => updateField("priority", event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-deadline">
            Deadline
          </label>
          <input
            className="form-input"
            id="task-deadline"
            type="date"
            value={values.deadline}
            onChange={(event) => updateField("deadline", event.target.value)}
          />
          {errors.deadline ? <p className="form-error">{errors.deadline}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="task-delay">
            Delay Days
          </label>
          <input
            className="form-input"
            id="task-delay"
            type="number"
            min="0"
            value={values.delayDays}
            onChange={(event) => updateField("delayDays", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="form-label">Blocked By</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Select tasks that must finish before this task can move.
          </p>
          {errors.blockedBy ? (
            <p className="form-error mt-1">{errors.blockedBy}</p>
          ) : null}
        </div>
        <div className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-2">
          {availableDependencies.map((dependency) => (
            <label
              key={dependency.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <input
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                type="checkbox"
                checked={values.blockedBy.includes(dependency.id)}
                onChange={() => toggleDependency(dependency.id)}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {dependency.title}
              </span>
              <Badge value={dependency.status} />
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Save Task" : "Create Task"}</Button>
      </div>
    </form>
  );
}
