import CountBadge from "../ui/CountBadge";

// The phone's column switcher: one tab per column, each with its task count.
export default function ColumnTabs({ statuses, counts, activeId, onChange }) {
  // Left/Right arrows move between tabs, as people expect from a tab bar.
  const handleKeyDown = (e, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = (index + step + statuses.length) % statuses.length;
    onChange(statuses[next].id);
    e.currentTarget.parentElement.children[next].focus();
  };

  return (
    <div role="tablist" aria-label="Board columns" className="flex gap-2">
      {statuses.map((status, i) => {
        const selected = status.id === activeId;
        return (
          <button
            key={status.id}
            id={`tab-${status.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="board-panel"
            tabIndex={selected ? 0 : -1} // only the active tab is a Tab-key stop
            onClick={() => onChange(status.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border px-2 py-2 text-sm font-medium transition-colors ${
              selected
                ? "border-accent bg-accent text-canvas"
                : "border-line-subtle bg-track text-muted hover:border-line hover:text-ink"
            }`}
          >
            {status.label}
            <CountBadge count={counts[status.id]} />
          </button>
        );
      })}
    </div>
  );
}