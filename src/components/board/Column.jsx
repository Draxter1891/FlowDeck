import { useDroppable } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { useBoard } from "../../context/AppContext";
import Button from "../ui/Button";
import CountBadge from "../ui/CountBadge";
import ColumnEmpty from "./ColumnEmpty";
import DraggableCard from "./DraggableCard";

// One desktop column: header, a drop zone, and its draggable cards.
export default function Column({ status, tasks }) {
  const { openCreate, openEdit, deleteTask } = useBoard();

  // The whole column is the drop target, so dropping on the header works too.
  const { ref, isDropTarget } = useDroppable({ id: status.id });

  return (
    <section
      ref={ref}
      aria-label={status.label}
      className={`flex min-w-80 flex-1 flex-col rounded-lg border bg-track transition-colors ${
        isDropTarget ? "border-accent" : "border-line-subtle"
      }`}
    >
      <header className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base leading-[22px] font-semibold">{status.label}</h2>
          <CountBadge count={tasks.length} />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          icon={Plus}
          aria-label={`Add task to ${status.label}`}
          onClick={() => openCreate(status.id)}
        />
      </header>

      {/* min-h keeps an empty column big enough to drop onto */}
      <div className="flex min-h-48 flex-1 flex-col gap-3 p-3">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} onEdit={openEdit} onDelete={deleteTask} />
        ))}

        {tasks.length === 0 && <ColumnEmpty status={status} />}
      </div>
    </section>
  );
}