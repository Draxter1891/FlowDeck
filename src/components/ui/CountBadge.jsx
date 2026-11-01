// Round tally used in column headers and mobile tabs.
export default function CountBadge({ count }) {
  return (
    <span className="tnum inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-line bg-container px-1.5 font-label text-xs font-medium text-accent">
      {count}
    </span>
  );
}