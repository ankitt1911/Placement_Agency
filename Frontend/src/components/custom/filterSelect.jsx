export default function FilterSelect({ label, value, onChange, options = [] }) {
  return (
    <label className="filter-control block">
      {label ? <span className="form-label">{label}</span> : null}
      <select className="form-input" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </label>
  );
}
