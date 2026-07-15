const toneMap = {
  Active: "bg-blue-50 text-blue-700 ring-blue-200",
  Open: "bg-blue-50 text-blue-700 ring-blue-200",
  Selected: "bg-blue-50 text-blue-700 ring-blue-200",
  Applied: "bg-brand-50 text-brand-700 ring-brand-100",
  Shortlisted: "bg-blue-50 text-blue-700 ring-blue-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Closed: "bg-slate-100 text-slate-700 ring-slate-200",
  Disabled: "bg-slate-100 text-slate-700 ring-slate-200",
  Withdrawn: "bg-slate-100 text-slate-700 ring-slate-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Inactive: "bg-red-50 text-red-700 ring-red-200"
};

export default function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ${toneMap[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>{status}</span>;
}
