import { ChevronDown } from "lucide-react";

// A styled native <select>: free keyboard support and a proper mobile picker.
// By default the label is screen-reader only; pass `showLabel` inside forms.
export default function Select({
  label,
  showLabel = false,
  value,
  onChange,
  options,
  icon: Icon,
  className = "",
}) {
  return (
    <label className={className}>
      <span className={showLabel ? "mb-1.5 block text-sm font-medium" : "sr-only"}>{label}</span>
      <span className="relative block">
        {Icon && (
          <Icon
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`field w-full appearance-none py-2 pr-9 text-sm ${Icon ? "pl-9" : "pl-3.5"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-track text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
        />
      </span>
    </label>
  );
}