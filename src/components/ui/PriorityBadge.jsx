import { getPriority } from "../../constants/board";

// Small chip: colors come from the PRIORITIES table, so they change in one place.
export default function PriorityBadge({ priority }) {
  const { label, badge } = getPriority(priority);
  return (
    <span
      className={`tnum inline-flex items-center rounded-sm border px-2 py-0.5 font-label text-[11px] leading-[14px] font-semibold tracking-[0.04em] ${badge}`}
    >
      {label}
    </span>
  );
}