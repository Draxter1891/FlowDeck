// Dates are stored as "YYYY-MM-DD" strings. In that format,
// plain string comparison orders dates correctly: no Date math needed.

const pad = (n) => String(n).padStart(2, "0");

// Today in the user's local timezone (toISOString would use UTC and slip a day).
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// A finished task is never "overdue", however old its date is.
export const isOverdue = (due, status) =>
  Boolean(due) && status !== "completed" && due < todayISO();

export const isDueToday = (due, status) =>
  Boolean(due) && status !== "completed" && due === todayISO();

// "Today", or a short readable date like "30 Oct 2026".
export const formatDue = (due) => {
  if (!due) return "No due date";
  if (due === todayISO()) return "Today";
  return new Date(`${due}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};