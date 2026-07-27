import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, Clock3, IndianRupee, MapPin, Sparkles } from "lucide-react";

export default function RecentOpeningCard({ opening, to = "/student/openings", state }) {
  const skills = (opening.skillList?.length ? opening.skillList : String(opening.skills || "").split(","))
    .map((skill) => String(skill).trim())
    .filter(Boolean);
  const companyInitial = String(opening.company || "C").trim().charAt(0).toUpperCase();
  const experience = opening.experience === 0
    ? "Fresher friendly"
    : opening.experience
      ? `${opening.experience}+ years`
      : opening.jobType || opening.category || "Opportunity";
  const postedDate = opening.postedDate
    ? new Date(opening.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Recently";

  return (
    <article className="group relative flex self-start flex-col overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br from-white via-blue-50/25 to-purple-50/40 p-3.5 shadow-[0_8px_24px_rgba(37,99,235,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_32px_rgba(37,99,235,0.11)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/35 transition duration-500 group-hover:scale-125" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-28 w-28 rounded-full bg-purple-100/30 transition duration-500 group-hover:scale-110" />
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-200" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xs font-black text-blue-700 shadow-sm ring-2 ring-white transition duration-300 group-hover:rotate-3 group-hover:scale-105">
            {companyInitial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.1em] text-blue-700">{opening.company || "Company"}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-portal-muted">
              <Sparkles className="h-3 w-3 text-amber-400" />
              New opportunity
            </p>
          </div>
        </div>
        <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50/60 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
          {opening.status || "Open"}
        </span>
      </div>

      <div className="relative mt-2.5">
        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-[1.15rem] text-portal-ink transition group-hover:text-blue-700">
          {opening.role || "Job opening"}
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-1">
          <span className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50/45 px-2 py-1 text-[10px] font-bold text-portal-ink">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span className="truncate">{opening.location || "Flexible"}</span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-purple-100 bg-purple-50/45 px-2 py-1 text-[10px] font-bold text-portal-ink">
            <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-purple-500" />
            <span className="truncate">{experience}</span>
          </span>
        </div>
      </div>

      <div className="relative mt-2 flex flex-wrap content-start gap-1">
        {skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full border border-blue-100/80 bg-blue-50/55 px-2 py-0.5 text-[9px] font-bold text-blue-700">
            {skill}
          </span>
        ))}
        {skills.length > 3 ? <span className="rounded-full bg-slate-100/70 px-2 py-0.5 text-[9px] font-bold text-slate-600">+{skills.length - 3}</span> : null}
        {!skills.length ? <span className="rounded-full border border-blue-100/80 bg-blue-50/55 px-2 py-0.5 text-[9px] font-bold text-blue-700">{opening.category || "Open role"}</span> : null}
      </div>

      <div className="relative mt-2.5 flex items-center justify-between gap-1.5 border-t border-blue-100/60 pt-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-bold text-portal-muted">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{postedDate}</span>
          {opening.salaryLabel ? <span className="inline-flex items-center gap-0.5 text-emerald-600"><IndianRupee className="h-3 w-3" />{opening.salaryLabel}</span> : null}
        </div>
        <Link className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100/70" to={to} state={state}>
          View
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
