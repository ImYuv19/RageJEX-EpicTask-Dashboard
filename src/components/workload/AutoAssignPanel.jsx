import { useState } from "react";
import { Wand2 } from "lucide-react";
import { PRIORITIES } from "../../utils/constants.js";
import { Button } from "../common/Button.jsx";
import { Card } from "../common/Card.jsx";

export function AutoAssignPanel({ projects, suggestedAssignee, onCreateTask }) {
  const [values, setValues] = useState({
    title: "New dependency review",
    projectId: projects[0]?.id || "",
    duration: 2,
    priority: "Medium",
    deadline: "2026-07-05",
  });

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.title.trim() || !values.projectId || !values.deadline) return;

    onCreateTask({
      ...values,
      status: "Todo",
      delayDays: 0,
      blockedBy: [],
      assignee: suggestedAssignee?.name || "",
    });
  };

  return (
    <Card
      title="Auto Assignment Engine"
      subtitle="Assigns the next task to the team member with the lowest workload."
    >
      <div className="mb-5 rounded-lg bg-violet-50 p-4 dark:bg-violet-500/10">
        <p className="text-xs font-bold uppercase text-primary">
          Suggested Assignee
        </p>
        <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
          {suggestedAssignee?.name || "No member available"}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lowest active workload based on current task distribution.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="form-label" htmlFor="auto-task-title">
            Task Title
          </label>
          <input
            className="form-input"
            id="auto-task-title"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="form-label" htmlFor="auto-project">
              Project
            </label>
            <select
              className="form-input"
              id="auto-project"
              value={values.projectId}
              onChange={(event) => updateField("projectId", event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="auto-priority">
              Priority
            </label>
            <select
              className="form-input"
              id="auto-priority"
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
            <label className="form-label" htmlFor="auto-duration">
              Duration
            </label>
            <input
              className="form-input"
              id="auto-duration"
              type="number"
              min="1"
              value={values.duration}
              onChange={(event) => updateField("duration", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="auto-deadline">
              Deadline
            </label>
            <input
              className="form-input"
              id="auto-deadline"
              type="date"
              value={values.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
            />
          </div>
        </div>
        <Button type="submit" icon={Wand2}>
          Assign to Lowest Workload
        </Button>
      </form>
    </Card>
  );
}
