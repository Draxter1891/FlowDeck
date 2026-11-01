import { useDraggable } from "@dnd-kit/react";
import TaskCard from "./TaskCard";

// Adds "can be picked up" to a card, and nothing else.
// The original dims while its floating copy (DragOverlay) travels with the pointer.
export default function DraggableCard(props) {
  const { ref, isDragging } = useDraggable({ id: props.task.id });

  return (
    <div ref={ref} className={`rounded-lg ${isDragging ? "opacity-40" : ""}`}>
      <TaskCard {...props} />
    </div>
  );
}