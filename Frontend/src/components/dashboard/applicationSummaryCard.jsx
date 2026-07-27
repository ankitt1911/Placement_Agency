import { Building2, CalendarDays, FileCheck2, MapPin, UserRound } from "lucide-react";
import StatusBadge from "../custom/statusBadge";

const statusTones = {
  Applied: {
    card: "border-blue-100 from-white to-blue-50/50",
    accent: "bg-blue-300",
    icon: "border-blue-100 bg-blue-50 text-blue-600"
  },
  "Under Review": {
    card: "border-amber-100 from-white to-amber-50/50",
    accent: "bg-amber-300",
    icon: "border-amber-100 bg-amber-50 text-amber-600"
  },
  Shortlisted: {
    card: "border-purple-100 from-white to-purple-50/50",
    accent: "bg-purple-300",
    icon: "border-purple-100 bg-purple-50 text-purple-600"
  },
  Selected: {
    card: "border-emerald-100 from-white to-emerald-50/50",
    accent: "bg-emerald-300",
    icon: "border-emerald-100 bg-emerald-50 text-emerald-600"
  },
  Rejected: {
    card: "border-red-100 from-white to-red-50/40",
    accent: "bg-red-300",
    icon: "border-red-100 bg-red-50 text-red-500"
  },
  Withdrawn: {
    card: "border-slate-200 from-white to-slate-50",
    accent: "bg-slate-300",
    icon: "border-slate-200 bg-slate-50 text-slate-500"
  }
};

const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function ApplicationSummaryCard({ application }) {
  const tone = statusTones[application.status] || statusTones.Applied;

  return (
    <article className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-r px-4 py-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)] ${tone.card}`}>
      <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${tone.accent}`} />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition duration-300 group-hover:scale-105 ${tone.icon}`}>
            <FileCheck2 className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="max-w-md truncate text-sm font-extrabold text-portal-ink">{application.role || "Job application"}</h3>
              {application.student ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-100 bg-purple-50/70 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                  <UserRound className="h-3 w-3" />
                  {application.student}
                </span>
              ) : null}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-portal-muted">
              <span className="inline-flex items-center gap-1 text-blue-700">
                <Building2 className="h-3 w-3" />
                {application.company || "Company"}
              </span>
              {application.location ? (
                <span className="inline-flex max-w-48 items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0 text-emerald-500" />
                  <span className="truncate">{application.location}</span>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-amber-500" />
                Applied {formatDate(application.appliedDate)}
              </span>
            </div>
          </div>
        </div>

        <StatusBadge status={application.status || "Applied"} />
      </div>
    </article>
  );
}
