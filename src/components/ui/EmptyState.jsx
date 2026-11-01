// An empty spot is an invitation: say what's missing and offer the next step.
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-8 text-center">
      {Icon && <Icon size={28} aria-hidden="true" className="text-dim" />}
      <div className="space-y-1">
        <p className="text-base leading-[22px] font-semibold">{title}</p>
        {description && (
          <p className="mx-auto max-w-xs text-xs leading-[18px] text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}