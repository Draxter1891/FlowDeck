// One button for the whole app. Pick a look with `variant`, a shape with `size`.
const VARIANTS = {
  primary:
    "border border-transparent bg-accent font-semibold text-canvas hover:bg-accent-hover active:bg-olive",
  secondary:
    "border border-line bg-container font-medium text-ink hover:border-olive hover:bg-card",
  ghost:
    "border border-transparent bg-transparent font-medium text-muted hover:bg-accent/10 hover:text-ink",
  danger:
    "border border-danger/50 bg-danger/10 font-medium text-danger hover:bg-danger/20",
};

const SIZES = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3.5 py-2 text-sm",
  icon: "p-2", // icon-only: always pass an aria-label
  "icon-sm": "p-1.5",
};

export default function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  type = "button", // so a stray button never submits a form
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}