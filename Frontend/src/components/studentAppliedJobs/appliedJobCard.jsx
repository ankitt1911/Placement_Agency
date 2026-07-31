import { BriefcaseBusiness, CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import StatusBadge from "../custom/statusBadge";

export default function AppliedJobCard({ application, onDetails, onWithdraw }) {
  const canWithdraw = !["Withdrawn", "Rejected", "Selected"].includes(application.status);
  return (
    <article className="listing-row">
      <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="listing-icon">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <h3 className="max-w-md truncate text-base font-extrabold text-portal-ink">{application.role}</h3>
            <StatusBadge status={application.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-11">
            <span className="listing-chip"><BriefcaseBusiness className="h-3.5 w-3.5 text-portal-muted" />{application.company}</span>
            <span className="listing-chip">{application.location}</span>
            <span className="listing-chip"><Sparkles className="h-3.5 w-3.5 text-portal-muted" />{application.skills}</span>
            <span className="listing-chip"><CalendarDays className="h-3.5 w-3.5 text-portal-muted" />Applied {application.appliedDate}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-start gap-2 xl:justify-end">
          <button className="listing-action listing-action-purple" onClick={() => onDetails(application)}>View Details</button>
          {canWithdraw ? (
            <button className="listing-action listing-action-red" onClick={() => onWithdraw(application)}>
              Withdraw<ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
