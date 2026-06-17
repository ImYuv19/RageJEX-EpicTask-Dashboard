import { History, Redo2, Undo2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatDateTime } from "../../utils/date.js";
import { Button } from "../common/Button.jsx";
import { Card } from "../common/Card.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function ScheduleHistoryPanel() {
  const { history, undoSchedule, redoSchedule } = useAppData();

  return (
    <Card
      title="Schedule Undo / Redo"
      subtitle="Duration updates are tracked with past, current, and future stacks."
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Undo2}
            disabled={!history.past?.length}
            onClick={undoSchedule}
          >
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Redo2}
            disabled={!history.future?.length}
            onClick={redoSchedule}
          >
            Redo
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase text-slate-400">Past Stack</p>
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {history.past?.length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-500/10">
          <p className="text-xs font-bold uppercase text-primary">Current State</p>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
            {history.current
              ? `${history.current.taskTitle}: ${history.current.newDuration} days`
              : "No active change"}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase text-slate-400">Future Stack</p>
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {history.future?.length || 0}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
          <History className="h-4 w-4 text-primary" />
          History Timeline
        </h3>
        {history.timeline?.length ? (
          <div className="space-y-3">
            {history.timeline.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {item.taskTitle}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {item.previousDuration} days to {item.newDuration} days
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDateTime(item.timestamp)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="No schedule changes"
            message="Edit a task duration to create the first timeline entry."
          />
        )}
      </div>
    </Card>
  );
}
