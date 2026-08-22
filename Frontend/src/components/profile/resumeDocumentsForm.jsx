import { FileText, Image } from "lucide-react";

function LinkField({ icon: Icon, label, value, placeholder, error, onChange }) {
  return (
    <label className="block rounded-xl border border-brand-100 bg-slate-50/80 p-4 transition focus-within:border-brand-300 focus-within:bg-white focus-within:shadow-sm">
      <span className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-portal-ink">{label}</span>
          {value ? <span className="mt-1 block truncate text-xs font-medium text-portal-muted">{value}</span> : null}
        </span>
      </span>
      <input
        className="mt-4 w-full rounded-lg border border-portal-border bg-white px-3 py-2 text-sm font-medium text-portal-ink outline-none transition placeholder:text-portal-muted focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        type="url"
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="mt-2 block text-xs font-semibold text-red-500">{error}</span> : null}
    </label>
  );
}

export default function ResumeDocumentsForm({ uploads, errors = {}, onChange }) {
  const uploadedCount = [uploads.resume, uploads.profilePhoto].filter(Boolean).length;
  const completion = Math.round((uploadedCount / 2) * 100);

  return (
    <section className="profile-card">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-portal-border pb-4">
        <div className="flex gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-sm">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="section-title">Resume & Documents</h2>
            <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-portal-muted">Add the latest links used by placement teams and recruiters.</p>
          </div>
        </div>
        <div className="min-w-[8rem] rounded-lg border border-portal-border bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-portal-muted">Files</span>
            <span className="text-xs font-extrabold text-brand-700">{completion}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <LinkField icon={FileText} label="Resume Link" value={uploads.resume} placeholder="https://drive.google.com/..." error={errors.resume} onChange={(value) => onChange("resume", value)} />
        <LinkField icon={Image} label="Profile Photo Link" value={uploads.profilePhoto} placeholder="https://example.com/photo.jpg" error={errors.profilePhoto} onChange={(value) => onChange("profilePhoto", value)} />
      </div>
    </section>
  );
}
