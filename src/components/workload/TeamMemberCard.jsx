import { UserRoundCheck, Edit2, Trash2 } from "lucide-react";
import { Button } from "../common/Button.jsx";

export function TeamMemberCard({ member, rank, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-primary dark:bg-violet-500/10">
            <UserRoundCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white">
              {member.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {member.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={onEdit}
            title="Edit member"
            aria-label="Edit member"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-danger dark:hover:text-red-400"
            onClick={onDelete}
            title="Delete member"
            aria-label="Delete member"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-500 dark:bg-slate-800">
            #{rank}
          </span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xl font-black text-slate-950 dark:text-white">
            {member.totalTasks}
          </p>
          <p className="text-xs font-bold text-slate-400">Total</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
          <p className="text-xl font-black text-secondary">
            {member.activeTasks}
          </p>
          <p className="text-xs font-bold text-slate-400">Active</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
          <p className="text-xl font-black text-danger">
            {member.blockedTasks}
          </p>
          <p className="text-xs font-bold text-slate-400">Blocked</p>
        </div>
      </div>
    </article>
  );
}
