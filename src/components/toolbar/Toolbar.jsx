import { Columns3, ListFilter, Search, X } from "lucide-react";
import { useBoard } from "../../context/AppContext";
import { PRIORITIES, STATUSES } from "../../constants/board";
import Button from "../ui/Button";
import Select from "../ui/Select";

// Built once, outside the component, so they aren't rebuilt on every keystroke.
const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  ...PRIORITIES.map((p) => ({ value: p.id, label: p.label })),
];
const STATUS_OPTIONS = [
  { value: "all", label: "All columns" },
  ...STATUSES.map((s) => ({ value: s.id, label: s.label })),
];

// Search by title, filter by priority and (on desktop) by column.
export default function Toolbar() {
  const { filters, hasActiveFilters, setSearch, setPriority, setStatus, resetFilters } = useBoard();

  return (
    <div role="search" className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 basis-full md:basis-64">
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          aria-label="Search tasks by title"
          className="field w-full py-2 pr-3.5 pl-9 text-sm [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <Select
        label="Filter by priority"
        icon={ListFilter}
        value={filters.priority}
        onChange={setPriority}
        options={PRIORITY_OPTIONS}
        className="flex-1 md:w-44 md:flex-none"
      />

      {/* Phones use the column tabs instead, so this filter is desktop-only */}
      <Select
        label="Filter by column"
        icon={Columns3}
        value={filters.status}
        onChange={setStatus}
        options={STATUS_OPTIONS}
        className="hidden md:block md:w-44"
      />

      {hasActiveFilters && (
        <Button variant="ghost" icon={X} onClick={resetFilters}>
          Clear
        </Button>
      )}
    </div>
  );
}