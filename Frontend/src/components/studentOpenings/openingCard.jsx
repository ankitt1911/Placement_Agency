import { BriefcaseBusiness, ChevronRight, Clock3, IndianRupee, MapPin, Sparkles } from "lucide-react";
import CustomButton from "../custom/customButton";
import StatusBadge from "../custom/statusBadge";

export default function OpeningCard({ opening, onDetails, onApply }) {
  return (
    <article className="listing-row">
      <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="listing-icon">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <h3 className="max-w-md truncate text-base font-extrabold text-portal-ink">{opening.role}</h3>
            <StatusBadge status={opening.applied ? "Applied" : opening.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-11">
            <span className="listing-chip"><BriefcaseBusiness className="h-3.5 w-3.5 text-portal-muted" />{opening.company}</span>
            <span className="listing-chip"><MapPin className="h-3.5 w-3.5 text-portal-muted" />{opening.location}</span>
            <span className="listing-chip"><Clock3 className="h-3.5 w-3.5 text-portal-muted" />{opening.experience}</span>
            <span className="listing-chip"><Sparkles className="h-3.5 w-3.5 text-portal-muted" />{opening.skills}</span>
            <span className="listing-chip"><IndianRupee className="h-3.5 w-3.5 text-portal-muted" />{opening.salary.toLocaleString()}</span>
            <span className="listing-chip">{opening.jobType}</span>
            <span className="listing-chip">{opening.category}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-start gap-2 xl:justify-end">
          {!opening.applied ? (
            <button className="listing-action listing-action-amber" onClick={() => onApply(opening)}>
              Apply<ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <CustomButton variant="secondary" className="rounded-full px-3 py-1.5 text-xs" onClick={() => onDetails(opening)}>View</CustomButton>
        </div>
      </div>
    </article>
  );
}
