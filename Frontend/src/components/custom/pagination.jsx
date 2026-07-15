export default function Pagination({ page, total, limit = 10, onChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
      <span>
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button className="secondary-btn px-3 py-1.5" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        <button className="secondary-btn px-3 py-1.5" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
