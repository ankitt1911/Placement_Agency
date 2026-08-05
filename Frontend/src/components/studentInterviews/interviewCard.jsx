import { Building2, CalendarDays, Clock, ExternalLink, MapPin, UserRound, Video } from "lucide-react";
import { interviewToneClass } from "../operations/interviews/interviewConstants";

const modeIcon = { Online: Video, "In-Person": MapPin, Telephonic: UserRound };

export default function StudentInterviewCard({ interview }) {
  const ModeIcon = modeIcon[interview.mode] || Video;
  return (
    <article className="listing-row">
      <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="listing-icon">
              <CalendarDays className="h-4 w-4" />
            </span>
            <h3 className="max-w-md truncate text-base font-extrabold text-portal-ink">{interview.role || "Interview"}</h3>
            {interview.round ? <span className="max-w-xs truncate text-xs font-semibold text-portal-muted">{interview.round}</span> : null}
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${interviewToneClass(interview.status)}`}>{interview.status}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-11">
            <span className="listing-chip"><Building2 className="h-3.5 w-3.5 text-portal-muted" />{interview.company || "-"}</span>
            <span className="listing-chip"><CalendarDays className="h-3.5 w-3.5 text-portal-muted" />{interview.dateTimeLabel || "-"}</span>
            <span className="listing-chip"><Clock className="h-3.5 w-3.5 text-portal-muted" />{interview.durationMinutes} min</span>
            <span className="listing-chip"><ModeIcon className="h-3.5 w-3.5 text-portal-muted" />{interview.mode}</span>
            {interview.interviewerName ? <span className="listing-chip"><UserRound className="h-3.5 w-3.5 text-portal-muted" />{interview.interviewerName}</span> : null}
            {interview.location ? <span className="listing-chip"><MapPin className="h-3.5 w-3.5 text-portal-muted" />{interview.location}</span> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-start gap-2 xl:justify-end">
          {interview.meetingLink ? (
            <a className="listing-action listing-action-blue" href={interview.meetingLink} target="_blank" rel="noreferrer">
              Join Meeting<ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
