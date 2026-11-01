import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { STATUSES } from "../constants/board";
import { isOverdue } from "../utils/date";
import { loadTasks, saveTasks } from "../utils/storage";

const AppContext = createContext(null);

/* ─────────────────────────────────────────────
   1. Task reducer: every change to the list goes through here
   ───────────────────────────────────────────── */
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "add":
      return [...tasks, action.task];
    case "update":
      return tasks.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t));
    case "move": // drag-and-drop and the mobile button both land here
      return tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
    case "delete":
      return tasks.filter((t) => t.id !== action.id);
    default:
      return tasks;
  }
}

/* ─────────────────────────────────────────────
   2. Small helpers and defaults
   ───────────────────────────────────────────── */
const DEFAULT_FILTERS = { search: "", priority: "all", status: "all" };
const MODAL_CLOSED = { mode: null, task: null, status: "todo" };

// Earliest due date first; no date goes last; ties keep creation order.
const FAR_FUTURE = "9999-12-31";
const byDueDate = (a, b) =>
  (a.dueDate || FAR_FUTURE).localeCompare(b.dueDate || FAR_FUTURE) || a.createdAt - b.createdAt;

/* ─────────────────────────────────────────────
   3. Provider: tasks, filters and modal in one place
   ───────────────────────────────────────────── */
export function AppProvider({ children }) {
  // The third argument reads saved tasks once, on first render only.
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modal, setModal] = useState(MODAL_CLOSED);

  // Save after every change so a refresh never loses work.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Actions never change between renders (dispatch and set* are stable),
  // so memoized children that receive them won't re-render for nothing.
  const actions = useMemo(
    () => ({
      // Tasks
      addTask: (fields) =>
        dispatch({
          type: "add",
          task: { id: crypto.randomUUID(), status: "todo", createdAt: Date.now(), ...fields },
        }),
      updateTask: (id, changes) => dispatch({ type: "update", id, changes }),
      moveTask: (id, status) => dispatch({ type: "move", id, status }),
      deleteTask: (id) => dispatch({ type: "delete", id }),

      // Filters
      setSearch: (search) => setFilters((f) => ({ ...f, search })),
      setPriority: (priority) => setFilters((f) => ({ ...f, priority })),
      setStatus: (status) => setFilters((f) => ({ ...f, status })),
      resetFilters: () => setFilters(DEFAULT_FILTERS),

      // Task dialog
      openCreate: (status = "todo") => setModal({ mode: "create", task: null, status }),
      openEdit: (task) => setModal({ mode: "edit", task, status: task.status }),
      closeModal: () => setModal(MODAL_CLOSED),
    }),
    []
  );

  // What the screen draws: tasks per column and headline stats.
  const board = useMemo(() => {
    const { search, priority, status } = filters;
    const query = search.trim().toLowerCase();

    const visible = tasks.filter(
      (t) =>
        (priority === "all" || t.priority === priority) &&
        (status === "all" || t.status === status) &&
        (!query || t.title.toLowerCase().includes(query))
    );

    // Start every column empty so an empty column still renders.
    const columns = Object.fromEntries(STATUSES.map((s) => [s.id, []]));
    visible.forEach((t) => columns[t.status].push(t));
    Object.values(columns).forEach((list) => list.sort(byDueDate));

    // Stats count ALL tasks, so filtering never changes the headline numbers.
    const stats = {
      total: tasks.length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
    };

    return {
      columns,
      stats,
      hasTasks: tasks.length > 0,
      visibleCount: visible.length,
      // Tells "no tasks yet" apart from "nothing matches your filters".
      hasActiveFilters: query !== "" || priority !== "all" || status !== "all",
    };
  }, [tasks, filters]);

  const value = useMemo(
    () => ({ ...board, filters, modal, ...actions }),
    [board, filters, modal, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ─────────────────────────────────────────────
   4. Hook: the only way components read board state
   ───────────────────────────────────────────── */
// eslint-disable-next-line react-refresh/only-export-components
export function useBoard() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useBoard must be used inside <AppProvider>");
  return ctx;
}