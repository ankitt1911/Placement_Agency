import { Link } from "react-router-dom";
import { BriefcaseBusiness, ChevronRight, MapPin } from "lucide-react";
import StatusBadge from "../custom/statusBadge";

export default function RecentOpeningCard({ opening, to = "/student/openings", state }) {
  return (
    <div className="listing-row animate-dashboard-enter">
      <div className="relative flex min-w-0 flex-wrap items-center gap-2">
        <span className="listing-icon">
          <BriefcaseBusiness className="h-4 w-4" />
        </span>
        <p className="max-w-[15rem] truncate font-extrabold text-portal-ink">{opening.role}</p>
        <StatusBadge status={opening.status} />
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2 pl-11">
        <span className="listing-chip">{opening.company}</span>
        <span className="listing-chip"><MapPin className="h-3.5 w-3.5 text-portal-muted" />{opening.location}</span>
        <span className="listing-chip">{opening.skills}</span>
      </div>
      <Link className="listing-action listing-action-purple relative mt-4 w-fit" to={to} state={state}>View opening<ChevronRight className="h-3.5 w-3.5" /></Link>
    </div>
  );
}
