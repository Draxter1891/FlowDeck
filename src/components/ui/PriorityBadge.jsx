import { getPriority } from "../../constants/board";

// Small chip: colors come from the PRIORITIES table, so they change in one place.
export default function PriorityBadge({ priority }) {
  const { label, badge } = getPriority(priority);
  return (
    <span
      className={`tnum inline-flex items-center rounded-xl border px-2.5 py-1 font-label text-xs leading-[14px] font-semibold tracking-[0.04em] ${badge}`}
    >
      {label}
    </span>
  );
}