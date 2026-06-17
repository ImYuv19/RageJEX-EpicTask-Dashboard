import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { PROJECT_STATUSES } from "../../utils/constants.js";
import { validateProjectTemplate } from "../../utils/validators.js";
import { Button } from "../common/Button.jsx";
import { TemplateChecker } from "./TemplateChecker.jsx";

export function ProjectForm({ project, onSubmit, onCancel }) {
  const { members } = useAppData();

  // Initialize milestones as a string array instead of a plain string
  const [values, setValues] = useState({
    name: project?.name || "",
    description: project?.description || "",
    owner: project?.owner || "",
    milestones: project?.milestones || [],
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    status: project?.status || "Planning",
    templateType: project?.templateType || "Standard",
  });

  const [newMilestone, setNewMilestone] = useState("");
  const [errors, setErrors] = useState([]);

  const templateValues = useMemo(
    () => ({
      ...values,
      milestones: values.milestones,
    }),
    [values]
  );

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors([]);
  };

  const updateTemplateType = (nextTemplateType) => {
    let nextMilestones = [];
    if (nextTemplateType === "Software Release") {
      nextMilestones = ["Requirements", "Development", "Testing", "Deployment"];
    } else if (nextTemplateType === "Marketing Campaign") {
      nextMilestones = ["Research", "Content Creation", "Launch", "Reporting"];
    } else if (nextTemplateType === "Product Launch") {
      nextMilestones = ["PR", "Beta Test", "Launch Event", "Feedback"];
    }

    setValues((currentValues) => ({
      ...currentValues,
      templateType: nextTemplateType,
      milestones: nextMilestones,
    }));
    setErrors([]);
  };

  const addCustomMilestone = (e) => {
    if (e) e.preventDefault();
    const clean = newMilestone.trim();
    if (!clean) return;

    if (values.milestones.some((m) => m.toLowerCase() === clean.toLowerCase())) {
      alert("This milestone already exists.");
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      milestones: [...currentValues.milestones, clean],
    }));
    setNewMilestone("");
  };

  const removeMilestone = (indexToRemove) => {
    setValues((currentValues) => ({
      ...currentValues,
      milestones: currentValues.milestones.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const templateResult = validateProjectTemplate(templateValues);

    if (!templateResult.approved) {
      setErrors(templateResult.messages);
      return;
    }

    const result = onSubmit(values);

    if (result && !result.ok) {
      setErrors(result.errors || ["Project could not be saved."]);
      return;
    }

    onCancel();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <TemplateChecker values={templateValues} />

      {/* Fallback box for non-template submission errors */}
      {errors.length > 0 && errors.some((err) => !templateResultContains(err, templateValues)) ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100">
          {errors.filter((err) => !templateResultContains(err, templateValues)).join(" ")}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="form-label" htmlFor="project-template">
          Project Template Type
        </label>
        <select
          className="form-input"
          id="project-template"
          value={values.templateType}
          onChange={(event) => updateTemplateType(event.target.value)}
        >
          <option value="Standard">Standard Project</option>
          <option value="Software Release">Software Release</option>
          <option value="Marketing Campaign">Marketing Campaign</option>
          <option value="Product Launch">Product Launch</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="form-label" htmlFor="project-name">
            Project Name
          </label>
          <input
            className="form-input"
            id="project-name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Atlas Enterprise Rollout"
          />
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="project-owner">
            Team Lead
          </label>
          <select
            className="form-input"
            id="project-owner"
            value={values.owner}
            onChange={(event) => updateField("owner", event.target.value)}
          >
            <option value="">Select lead</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="form-label" htmlFor="project-description">
          Description
        </label>
        <textarea
          className="form-input min-h-24"
          id="project-description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Project scope and delivery objective"
        />
      </div>

      {/* Interactive Milestone Chip Editor */}
      <div className="space-y-3">
        <div>
          <label className="form-label">Project Milestones</label>
          <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
            Selected template milestones appear as tags. Click the &times; icon to remove them, or add custom milestones below.
          </p>
        </div>

        {/* Chips Container */}
        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 min-h-12">
          {values.milestones.length ? (
            values.milestones.map((milestone, idx) => (
              <span
                key={`${milestone}-${idx}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-primary dark:bg-violet-500/10"
              >
                {milestone}
                <button
                  type="button"
                  className="rounded-full hover:bg-violet-200/50 p-0.5 text-slate-400 hover:text-primary transition"
                  onClick={() => removeMilestone(idx)}
                  title={`Remove ${milestone}`}
                >
                  <span className="text-xs font-black">&times;</span>
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 self-center">No milestones added yet.</span>
          )}
        </div>

        {/* Input to Add Custom Milestones */}
        <div className="flex gap-2">
          <input
            className="form-input"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Type custom milestone name (e.g. Design review)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomMilestone(e);
              }
            }}
          />
          <Button type="button" onClick={addCustomMilestone} variant="outline">
            Add
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="form-label" htmlFor="project-start">
            Start Date
          </label>
          <input
            className="form-input"
            id="project-start"
            type="date"
            value={values.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="project-end">
            End Date
          </label>
          <input
            className="form-input"
            id="project-end"
            type="date"
            value={values.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="project-status">
            Status
          </label>
          <select
            className="form-input"
            id="project-status"
            value={values.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          {project ? "Save Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

// Helper function to check if template validation messages contain a specific error
function templateResultContains(error, templateValues) {
  const result = validateProjectTemplate(templateValues);
  return result.messages.includes(error);
}
