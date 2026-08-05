import CustomButton from "../../custom/customButton";

export default function ExportColumnsModal({ open, title, subtitle = "Choose the student profile columns to include.", allLabel = "All student profile columns", columns = [], selectedFields = [], onChange, onClose, onExport, loading }) {
  if (!open) return null;
  const selectedSet = new Set(selectedFields);
  const allSelected = columns.length > 0 && selectedFields.length === columns.length;
  const toggleField = (key) => {
    onChange(selectedSet.has(key) ? selectedFields.filter((field) => field !== key) : [...selectedFields, key]);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-shell flex max-h-[88vh] max-w-4xl flex-col">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Export Excel</span>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-subtitle">{subtitle}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">X</button>
        </div>
        <div className="modal-body overflow-auto">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-portal-muted">{selectedFields.length} of {columns.length} columns selected</p>
            <div className="flex gap-2">
              <button className="secondary-btn px-3 py-1.5" type="button" onClick={() => onChange(columns.map((column) => column.key))}>
                Select all
              </button>
              <button className="secondary-btn px-3 py-1.5" type="button" onClick={() => onChange([])}>
                Clear
              </button>
            </div>
          </div>
          <label className="mb-3 flex items-center gap-2 rounded-lg border border-portal-border bg-slate-50 px-3 py-2 text-sm font-bold text-portal-ink">
            <input type="checkbox" checked={allSelected} onChange={(event) => onChange(event.target.checked ? columns.map((column) => column.key) : [])} />
            {allLabel}
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((column) => (
              <label key={column.key} className="flex min-w-0 items-center gap-2 rounded-lg border border-portal-border bg-white px-3 py-2 text-sm font-semibold text-portal-ink">
                <input type="checkbox" checked={selectedSet.has(column.key)} onChange={() => toggleField(column.key)} />
                <span className="truncate">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-portal-border bg-slate-50 px-5 py-4">
          <CustomButton variant="secondary" type="button" onClick={onClose}>Cancel</CustomButton>
          <CustomButton type="button" onClick={onExport} loading={loading} disabled={!selectedFields.length}>
            Export
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
