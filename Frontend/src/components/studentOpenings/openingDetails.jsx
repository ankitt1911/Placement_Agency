import { Award, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, GraduationCap, IndianRupee, Link2, MapPin, Sparkles, UsersRound } from "lucide-react";

const splitList = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean);

function FactCard({ label, value, icon: Icon, tone }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide opacity-75">{label}</p>
          <p className="mt-0.5 break-words text-sm font-extrabold">{value || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
}

function DetailTile({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-portal-border bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-wide text-portal-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-extrabold text-portal-ink">{value}</p>
    </div>
  );
}

export default function OpeningDetails({ opening, showVacancies = true }) {
  if (!opening) return null;

  const skills = splitList(opening.skills || opening.eligibility);
  const languages = splitList(opening.languages);
  const salary = opening.salaryLabel || (opening.salary ? `Rs. ${opening.salary.toLocaleString()}` : "Not disclosed");
  const factCards = [
    { label: "Company", value: opening.company, icon: Building2, tone: "border-blue-100 bg-blue-50 text-blue-700" },
    { label: "Location", value: opening.location, icon: MapPin, tone: "border-emerald-100 bg-emerald-50 text-emerald-700" },
    { label: "Salary", value: salary, icon: IndianRupee, tone: "border-rose-100 bg-rose-50 text-rose-700" },
    { label: "Deadline", value: opening.applicationDeadlineDate || "Open", icon: CalendarDays, tone: "border-sky-100 bg-sky-50 text-sky-700" },
  ];
  const eligibilityRows = [
    ["Minimum CGPA", opening.minCGPA],
    ["Active Backlogs", opening.activeBacklogs],
    ["Eligible Branches", opening.branches],
    ["Passing Year", opening.passingYear],
    ["Application Status", opening.applicationStatus],
  ];

  return (
    <div className="space-y-6 pb-3 text-sm text-portal-ink">
      <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="bg-blue-600 px-5 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ring-1 ring-white/25">
              <BriefcaseBusiness className="h-4 w-4" />
              Opening details
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              {opening.status || "Open"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">{opening.company || "Company"}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-portal-ink">{opening.role || opening.title}</h2>
          <p className="mt-3 leading-7 text-portal-muted">{opening.description || "No description available."}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {factCards.map((card) => <FactCard key={card.label} {...card} />)}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {showVacancies ? <FactCard label="Vacancies" value={opening.vacancies || "-"} icon={UsersRound} tone="border-blue-100 bg-blue-50 text-blue-700" /> : null}
        <FactCard label="Experience" value={opening.experience ? `${opening.experience} years` : "-"} icon={Award} tone="border-purple-100 bg-purple-50 text-purple-700" />
        <FactCard label="Mode" value={opening.jobType || "-"} icon={BriefcaseBusiness} tone="border-amber-100 bg-amber-50 text-amber-700" />
        <FactCard label="Category" value={opening.category || "-"} icon={BriefcaseBusiness} tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
      </div>

      <section className="rounded-3xl border border-portal-border bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-portal-ink">Skills</h3>
            <p className="text-xs font-semibold text-portal-muted">Technology and eligibility keywords for this opening.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.length ? skills.map((item) => <span className="modal-chip" key={item}>{item}</span>) : <span className="text-portal-muted">No skills listed.</span>}
        </div>
      </section>

      <section className="rounded-3xl border border-portal-border bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-portal-ink">Languages</h3>
            <p className="text-xs font-semibold text-portal-muted">Preferred communication languages for this opening.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {languages.length ? languages.map((item) => <span className="modal-chip" key={item}>{item}</span>) : <span className="text-portal-muted">No languages listed.</span>}
        </div>
      </section>

      <section className="rounded-3xl border border-portal-border bg-slate-50/80 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-portal-ink">Eligibility</h3>
            <p className="text-xs font-semibold text-portal-muted">Academic conditions and application state.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {eligibilityRows.map(([label, value]) => <DetailTile key={label} label={label} value={value} />)}
          <DetailTile label="Posted On" value={opening.postedDate} />
        </div>
      </section>

      <section className="rounded-3xl border border-portal-border bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 text-purple-700">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-portal-ink">Company Info</h3>
            <p className="text-xs font-semibold text-portal-muted">Organization details shared with the opening.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DetailTile label="Industry" value={opening.companyIndustry || "No company details available."} />
          <DetailTile label="Website" value={opening.companyWebsite ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{opening.companyWebsite}</span> : ""} />
        </div>
      </section>
    </div>
  );
}
