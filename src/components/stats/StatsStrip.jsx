import { useBoard } from "../../context/AppContext";

// One figure with its label. On phones the label sits above the number; on desktop, beside it.
function Stat({ label, hint, value, tone = "text-ink" }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="hidden text-xs text-muted md:block">{hint}</p>
      </div>
      <p className={`tnum text-xl font-semibold md:text-[26px] md:leading-8 ${tone}`}>{value}</p>
    </div>
  );
}

// Headline numbers. They count every task, so filters never change them.
export default function StatsStrip() {
  const { stats } = useBoard();

  return (
    <section
      aria-label="Board summary"
      className="grid grid-cols-3 divide-x divide-line-subtle rounded-lg border border-line-subtle bg-track"
    >
      <Stat label="Total tasks" hint="Across all columns" value={stats.total} />
      <Stat label="In progress" hint="Currently active" value={stats.inProgress} />
      <Stat
        label="Overdue"
        hint="Past their due date"
        value={stats.overdue}
        tone={stats.overdue > 0 ? "text-danger" : "text-ink"}
      />
    </section>
  );
}