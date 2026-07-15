export default function AppliedJobDetails({ application }) {
  if (!application) return null;
  return (
    <div className="space-y-4 text-sm text-portal-ink">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="modal-score-card border-purple-200 bg-purple-50">
          <p className="text-base font-extrabold text-purple-700">{application.company}</p>
          <p className="text-xs font-bold uppercase text-portal-muted">Company</p>
        </div>
        <div className="modal-score-card border-blue-200 bg-blue-50">
          <p className="text-base font-extrabold text-blue-700">{application.status}</p>
          <p className="text-xs font-bold uppercase text-portal-muted">Current Status</p>
        </div>
      </div>
      <section className="modal-section">
        <h3 className="modal-section-title">Role</h3>
        <p className="mt-2 leading-6 text-portal-muted">{application.role}</p>
      </section>
      <section className="modal-section">
        <h3 className="modal-section-title">Status Timeline</h3>
        <ol className="mt-3 space-y-2">
          {application.timeline.map((item) => (
            <li className="flex items-center gap-3 rounded-lg border border-portal-border bg-white px-3 py-2" key={item}>
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.18)]" />
              <span className="font-semibold text-portal-ink">{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
