import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { useBoard } from "../../context/AppContext";
import { STATUSES } from "../../constants/board";
import Column from "./Column";
import TaskCard from "./TaskCard";

// The drag-and-drop board: three columns side by side.
// This file only listens to the drag; the actual move is the shared moveTask().
// The library's default sensors already do what we need: a few pixels of movement
// (or a short hold on touch) before a drag starts, so clicking edit or delete is safe.
export default function DesktopBoard() {
  const { columns, moveTask } = useBoard();
  const allTasks = Object.values(columns).flat();

  const handleDragEnd = ({ canceled, operation }) => {
    const { source, target } = operation;
    // Cancelled with Esc, or dropped outside every column: nothing to do.
    if (canceled || !source || !target) return;

    const task = allTasks.find((t) => t.id === source.id);
    // Dropped back where it started: nothing to do either.
    if (task && task.status !== target.id) moveTask(task.id, target.id);
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {/* Wide enough for 3 columns, otherwise the track scrolls sideways */}
      <div className="flex gap-5 overflow-x-auto pb-6">
        {STATUSES.map((status) => (
          <Column key={status.id} status={status} tasks={columns[status.id]} />
        ))}
      </div>

      {/* The floating copy that follows the pointer; the library hands us the dragged item */}
      <DragOverlay>
        {(source) => {
          const task = allTasks.find((t) => t.id === source.id);
          return task ? <TaskCard task={task} lifted /> : null;
        }}
      </DragOverlay>
    </DragDropProvider>
  );
}