import { ShieldCheck, ShieldAlert, ShieldX, CheckCircle2, XCircle } from "lucide-react";
import { validateProjectTemplate } from "../../utils/validators.js";
import { Badge } from "../common/Badge.jsx";

export function TemplateChecker({ values }) {
  const result = validateProjectTemplate(values);

  let status = "Approved"; // Approved, Warning, Rejected
  if (!result.approved) {
    const hasCriticalMissing =
      !values.name?.trim() ||
      !values.owner?.trim() ||
      !values.startDate ||
      !values.endDate ||
      (result.templateType !== "Standard" && result.missingRequiredMilestones.length > 0);

    status = hasCriticalMissing ? "Rejected" : "Warning";
  }

  const statusColors = {
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    Warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100",
    Rejected: "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100",
  };

  const statusIcons = {
    Approved: ShieldCheck,
    Warning: ShieldAlert,
    Rejected: ShieldX,
  };

  const Icon = statusIcons[status];

  return (
    <div className="space-y-4">
      {/* Template Preview Panel */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Template Preview</p>
            <h4 className="text-base font-black text-slate-950 dark:text-white mt-1">
              {result.templateType}
            </h4>
          </div>
          <Badge value={status} />
        </div>

        {result.templateType !== "Standard" && result.requiredMilestones?.length ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold uppercase text-slate-400">Required Milestones</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.requiredMilestones.map((milestone) => {
                const isMissing = result.missingRequiredMilestones.includes(milestone);
                return (
                  <div
                    key={milestone}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800"
                  >
                    {isMissing ? (
                      <XCircle className="h-4 w-4 text-danger shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    )}
                    <span className={isMissing ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"}>
                      {milestone}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Standard project allows any milestones. No template constraints apply.
          </p>
        )}
      </div>

      {/* Validation Status Banner */}
      <div className={`rounded-lg border p-4 ${statusColors[status]}`}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 shrink-0" />
          <p className="font-bold">Compliance Status</p>
        </div>
        {status === "Approved" ? (
          <p className="mt-2 text-sm">
            All template requirements are satisfied. The project setup is fully compliant.
          </p>
        ) : (
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
            {result.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
