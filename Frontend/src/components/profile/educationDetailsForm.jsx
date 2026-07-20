import { GraduationCap } from "lucide-react";

const qualifications = [
  {
    name: "tenth",
    label: "10th",
    required: true,
    fields: [
      { name: "board", label: "Board" },
      { name: "year", label: "Passing year", type: "number" },
      { name: "percentage", label: "Percentage", type: "number", min: 0, max: 100, step: "0.01" }
    ]
  },
  {
    name: "twelfth",
    label: "12th",
    required: true,
    fields: [
      { name: "board", label: "Board" },
      { name: "year", label: "Passing year", type: "number" },
      { name: "percentage", label: "Percentage", type: "number", min: 0, max: 100, step: "0.01" }
    ]
  },
  {
    name: "diploma",
    label: "Diploma (optional)",
    fields: [
      { name: "college", label: "College" },
      { name: "university", label: "University / Board" },
      { name: "branch", label: "Branch" },
      { name: "cgpa", label: "CGPA", type: "number", min: 0, max: 10, step: "0.01" },
      { name: "passingYear", label: "Passing year", type: "number" }
    ]
  },
  {
    name: "graduation",
    label: "Graduation",
    required: true,
    fields: [
      { name: "college", label: "College" },
      { name: "university", label: "University" },
      { name: "branch", label: "Branch / Course" },
      { name: "cgpa", label: "CGPA", type: "number", min: 0, max: 10, step: "0.01" },
      { name: "passingYear", label: "Passing year", type: "number" }
    ]
  },
  {
    name: "postGraduation",
    label: "Post graduation (optional)",
    fields: [
      { name: "college", label: "College" },
      { name: "university", label: "University" },
      { name: "branch", label: "Branch / Course" },
      { name: "cgpa", label: "CGPA", type: "number", min: 0, max: 10, step: "0.01" },
      { name: "passingYear", label: "Passing year", type: "number" }
    ]
  }
];

const hasValue = (value) => value !== "" && value !== null && value !== undefined;

export default function EducationDetailsForm({ data = {}, onChange, errors = {} }) {
  const allFields = qualifications.flatMap((qualification) => qualification.fields.map((field) => data[qualification.name]?.[field.name]));
  const filled = allFields.filter(hasValue).length;
  const completion = allFields.length ? Math.round((filled / allFields.length) * 100) : 0;

  return (
    <section className="profile-card md:col-span-2">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-portal-border pb-4">
        <div className="flex min-w-0 gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="section-title">Education</h2>
            <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-portal-muted">Enter each education detail in its own field.</p>
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

      <div className="grid gap-5 lg:grid-cols-2">
        {qualifications.map((qualification) => (
          <fieldset key={qualification.name} className="rounded-xl border border-portal-border bg-slate-50/60 p-4">
            <legend className="px-2 text-sm font-extrabold text-portal-ink">
              {qualification.label}{qualification.required ? <span className="ml-1 text-red-600">*</span> : null}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {qualification.fields.map((field) => {
                const errorKey = `${qualification.name}.${field.name}`;
                return (
                  <label key={field.name}>
                    <span className="form-label">{field.label}{qualification.required ? <span className="ml-1 text-red-600">*</span> : null}</span>
                    <input
                      className="form-input"
                      type={field.type || "text"}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      required={qualification.required}
                      value={data[qualification.name]?.[field.name] ?? ""}
                      onChange={(event) => onChange(qualification.name, field.name, event.target.value)}
                    />
                    {errors[errorKey] ? <span className="mt-1 block text-xs text-red-600">{errors[errorKey]}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
