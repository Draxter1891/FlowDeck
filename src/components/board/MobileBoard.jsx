import { useState } from "react";
import { useBoard } from "../../context/AppContext";
import { STATUSES } from "../../constants/board";
import ColumnEmpty from "./ColumnEmpty";
import ColumnTabs from "./ColumnTabs";
import TaskCard from "./TaskCard";

// Phone layout: one column on screen at a time, switched with tabs.
// No dragging here: each card has a button that sends it to the next column.
export default function MobileBoard() {
  const { columns, moveTask, openEdit, deleteTask } = useBoard();
  const [activeId, setActiveId] = useState(STATUSES[0].id);

  const status = STATUSES.find((s) => s.id === activeId);
  const tasks = columns[activeId];
  const counts = Object.fromEntries(STATUSES.map((s) => [s.id, columns[s.id].length]));

  return (
    <div className="space-y-3 pb-6">
      <ColumnTabs statuses={STATUSES} counts={counts} activeId={activeId} onChange={setActiveId} />

      <div role="tabpanel" id="board-panel" aria-labelledby={`tab-${activeId}`} className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={openEdit}
            onDelete={deleteTask}
            onMove={moveTask}
          />
        ))}
        {tasks.length === 0 && <ColumnEmpty status={status} />}
      </div>
    </div>
  );
}