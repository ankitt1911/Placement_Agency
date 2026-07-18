import { CheckCircle2 } from "lucide-react";

export default function ProfileSection({ title, fields, data, onChange, errors = {}, icon: Icon = CheckCircle2, description = "Fill the details that help verify your placement readiness." }) {
  const filled = fields.filter((field) => String(data[field.name] || "").trim()).length;
  const completion = fields.length ? Math.round((filled / fields.length) * 100) : 0;

  return (
    <section className="profile-card">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-portal-border pb-4">
        <div className="flex min-w-0 gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="section-title">{title}</h2>
            <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-portal-muted">{description}</p>
          </div>
        </div>
        <div className="min-w-[8rem] rounded-lg border border-portal-border bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-portal-muted">Section</span>
            <span className="text-xs font-extrabold text-brand-700">{completion}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" || field.wide ? "md:col-span-2" : ""}>
            <span className="form-label">{field.label}{field.required ? <span className="ml-1 text-red-600">*</span> : null}</span>
            {field.type === "textarea" ? (
              <textarea required={field.required} className="form-input min-h-28 rounded-lg" placeholder={field.placeholder || ""} value={data[field.name] || ""} onChange={(event) => onChange(field.name, event.target.value)} />
            ) : (
              <input required={field.required} className="form-input" type={field.type || "text"} placeholder={field.placeholder || ""} value={data[field.name] || ""} onChange={(event) => onChange(field.name, event.target.value)} />
            )}
            {errors[field.name] ? <span className="mt-1 block text-xs text-red-600">{errors[field.name]}</span> : null}
          </label>
        ))}
      </div>
    </section>
  );
}
