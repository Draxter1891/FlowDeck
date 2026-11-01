import { memo, useState } from "react";
import { Calendar, Check, Pencil, Play, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import { NEXT_ACTION, getPriority } from "../../constants/board";
import { formatDue, isDueToday, isOverdue } from "../../utils/date";
import Button from "../ui/Button";
import PriorityBadge from "../ui/PriorityBadge";

// Icon for the one-tap move button, chosen by where the task is heading.
const MOVE_ICONS = { "in-progress": Play, completed: Check, todo: RotateCcw };

// Due date chip. Overdue also says so in words, so color is never the only clue.
function DueDate({ due, status }) {
  if (!due) return <span className="text-xs text-dim">No due date</span>;

  const overdue = isOverdue(due, status);
  const Icon = overdue ? TriangleAlert : Calendar;
  const tone = overdue
    ? "border-danger/40 bg-danger/10 text-danger"
    : isDueToday(due, status)
      ? "border-olive bg-olive/25 text-ink"
      : "border-line-subtle text-muted";

  return (
    <span
      className={`tnum inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-label text-xs font-medium ${tone}`}
    >
      <Icon size={13} aria-hidden="true" />
      {overdue && "Overdue "}
      {formatDue(due)}
    </span>
  );
}

// Pure display: it knows nothing about the board. Everything arrives as props,
// which is what lets React.memo skip re-rendering cards that didn't change.
//   onEdit / onDelete: edit and trash buttons
//   onMove: optional one-tap move button (phones only)
//   lifted: the floating copy shown while dragging
function TaskCard({ task, onEdit, onDelete, onMove, lifted = false }) {
  const [confirming, setConfirming] = useState(false);
  const { edge } = getPriority(task.priority);
  const next = NEXT_ACTION[task.status];

  return (
    <article
      className={`relative overflow-hidden rounded-lg border p-4 pl-5 transition-colors ${
        lifted
          ? "border-olive bg-card-hover shadow-lifted"
          : "border-line bg-card shadow-card hover:border-olive hover:bg-card-hover"
      }`}
    >
      {/* Left strip: priority at a glance */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${edge}`} />

      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={task.priority} />

        {/* Deleting takes two clicks, so one slip never loses a task */}
        {confirming ? (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Keep
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete?.(task.id)}>
              Delete
            </Button>
          </div>
        ) : (
          <div className="-mt-1 -mr-1.5 flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              icon={Pencil}
              aria-label={`Edit ${task.title}`}
              onClick={() => onEdit?.(task)}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              icon={Trash2}
              aria-label={`Delete ${task.title}`}
              onClick={() => setConfirming(true)}
            />
          </div>
        )}
      </div>

      <h3 className="mt-3 text-base leading-[22px] font-semibold break-words">{task.title}</h3>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-[18px] break-words text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line-subtle pt-3">
        <DueDate due={task.dueDate} status={task.status} />
        {onMove && (
          <Button size="sm" icon={MOVE_ICONS[next.to]} onClick={() => onMove(task.id, next.to)}>
            {next.label}
          </Button>
        )}
      </div>
    </article>
  );
}

export default memo(TaskCard);