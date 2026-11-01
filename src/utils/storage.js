import { STORAGE_KEY, STATUSES } from "../constants/board";

const validStatuses = new Set(STATUSES.map((s) => s.id));

// Reject anything that doesn't look like a task, so bad data can't crash the board.
const looksLikeTask = (t) =>
  t && typeof t.id === "string" && typeof t.title === "string" && validStatuses.has(t.status);

export function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(looksLikeTask) : [];
  } catch {
    return []; // empty, corrupted or blocked storage: start fresh
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage full or blocked: the board still works for this session.
  }
}