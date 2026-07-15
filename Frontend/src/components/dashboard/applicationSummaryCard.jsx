import { FileCheck2 } from "lucide-react";
import StatusBadge from "../custom/statusBadge";

export default function ApplicationSummaryCard({ application }) {
  return (
    <div className="listing-row animate-dashboard-enter">
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="listing-icon">
            <FileCheck2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-extrabold text-portal-ink">{application.role}</p>
            <p className="text-sm font-medium text-portal-muted">{application.company} • Applied {application.appliedDate}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>
    </div>
  );
}
