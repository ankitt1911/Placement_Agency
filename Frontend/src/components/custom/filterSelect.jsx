import { X } from "lucide-react";

export default function FilterSelect({ label, value, onChange, options = [] }) {
  const formatLabel = (optionLabel) => label?.toLowerCase().includes("location")
    ? String(optionLabel || "").split(",")[0].trim()
    : optionLabel;
  const selectedOption = options.find((option) => String(option?.value ?? option) === String(value));
  const selectedLabel = formatLabel(selectedOption && typeof selectedOption === "object" ? selectedOption.label : selectedOption || value);

  return (
    <div className="filter-control">
      <label className="block">
        <span className="sr-only">{label || "Filter"}</span>
        <select className="form-input" value="" aria-label={label || "Filter"} onChange={(event) => onChange(event.target.value)}>
          <option value="">{label || "All"}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {formatLabel(option.label || option)}
            </option>
          ))}
        </select>
      </label>
      {value !== "" && value !== null && value !== undefined ? (
        <span className="absolute left-0 top-full mt-2 inline-flex max-w-full items-center gap-0.5 rounded-full border border-red-100 bg-red-50 px-1.5 py-px text-[9px] font-bold leading-4 text-portal-ink">
          <span className="truncate">{selectedLabel}</span>
          <button
            type="button"
            className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-red-600 transition hover:bg-red-100 hover:text-red-700"
            onClick={() => onChange("")}
            aria-label={`Remove ${label || "selected"} filter`}
            title={`Remove ${label || "selected"} filter`}
          >
            <X className="h-2.5 w-2.5" strokeWidth={3} />
          </button>
        </span>
      ) : null}
    </div>
  );
}
