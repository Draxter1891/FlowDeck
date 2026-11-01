// One source of truth for columns, priorities and storage.
// Components read from here, so nothing is hard-coded twice.

export const STORAGE_KEY = "flowdeck.tasks.v1";

// Order here is the order on screen (and in the mobile tabs).
export const STATUSES = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

// `badge` styles the chip, `edge` colors the card's left strip.
export const PRIORITIES = [
  { id: "low", label: "Low", badge: "bg-accent border-line text-gray-900", edge: "bg-line" },
  { id: "medium", label: "Medium", badge: "bg-yellow-400/80 border-yellow-500 text-yellow-950", edge: "bg-olive" },
  { id: "high", label: "High", badge: "bg-red-500/70 border-red-950 text-red-950 text-canvas", edge: "bg-accent" },
];

// Where the one-tap button on a card sends a task (used on mobile).
export const NEXT_ACTION = {
  todo: { to: "in-progress", label: "Start" },
  "in-progress": { to: "completed", label: "Done" },
  completed: { to: "todo", label: "Reopen" },
};

export const getPriority = (id) => PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];