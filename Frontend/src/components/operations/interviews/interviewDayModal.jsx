import { CalendarDays, ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { handleUpdateInterviewStatus } from "../../../Services/apiCalling/interviewApis";
import { SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import CustomButton from "../../custom/customButton";
import EmptyState from "../../custom/emptyState";
import { formatDayHeading, interviewStatuses, interviewToneClass } from "./interviewConstants";

function InterviewCard({ interview, expanded, onToggle, onSaved, onReschedule }) {
  const [status, setStatus] = useState(interview.status);
  const [feedback, setFeedback] = useState(interview.feedback || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(interview.status);
    setFeedback(interview.feedback || "");
  }, [interview.status, interview.feedback]);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await handleUpdateInterviewStatus(interview.id, status, feedback.trim());
      SuccessMessage("Interview status updated");
      onSaved(saved);
    } finally {
      setSaving(false);
    }
  };

  const unchanged = status === interview.status && feedback.trim() === (interview.feedback || "");

  return (
    <article className="rounded-xl border border-portal-border bg-white shadow-sm">
      <button type="button" className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left" onClick={onToggle}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-portal-ink">{interview.timeLabel}</span>
            <span className="truncate text-sm font-bold text-portal-ink">{interview.student || "Candidate"}</span>
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${interviewToneClass(interview.status)}`}>{interview.status}</span>
          </div>
          <p className="mt-1 truncate text-xs font-semibold text-portal-muted">
            {[interview.role, interview.company, interview.round, interview.mode].filter(Boolean).join(" • ")}
          </p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-portal-muted" /> : <ChevronDown className="h-4 w-4 shrink-0 text-portal-muted" />}
      </button>
      {expanded ? (
        <div className="border-t border-portal-border px-4 py-4">
          <div className="modal-detail-grid">
            <p><b>Candidate:</b> {interview.student || "-"}</p>
            <p><b>Email:</b> {interview.email || "-"}</p>
            <p><b>Mobile:</b> {interview.mobile || "-"}</p>
            <p><b>College:</b> {interview.college || "-"}</p>
            <p><b>Company:</b> {interview.company || "-"}</p>
            <p><b>Role:</b> {interview.role || "-"}</p>
            <p><b>Round:</b> {interview.round || "-"}</p>
            <p><b>Mode:</b> {interview.mode}</p>
            <p><b>Scheduled:</b> {interview.dateTimeLabel || "-"}</p>
            <p><b>Duration:</b> {interview.durationMinutes} min</p>
            <p><b>Interviewer:</b> {interview.interviewerName || "-"}</p>
            <p><b>Interviewer Email:</b> {interview.interviewerEmail || "-"}</p>
            {interview.meetingLink ? (
              <p className="sm:col-span-2">
                <b>Meeting Link:</b>{" "}
                <a className="break-all text-brand-700 underline" href={interview.meetingLink} target="_blank" rel="noreferrer">{interview.meetingLink}</a>
              </p>
            ) : null}
            {interview.location ? <p className="sm:col-span-2"><b>Venue:</b> {interview.location}</p> : null}
            <p><b>Scheduled By:</b> {interview.scheduledByName || "-"}</p>
            <p><b>Last Updated By:</b> {interview.updatedByName || "-"}</p>
          </div>
          {interview.noteList.length ? (
            <div className="modal-section mt-4">
              <h3 className="modal-section-title">Notes</h3>
              <ul className="mt-3 grid gap-2">
                {interview.noteList.map((note, index) => (
                  <li key={`${note.date}-${index}`} className="text-sm font-semibold leading-6 text-portal-muted">
                    {note.date ? <span className="mr-2 text-xs font-extrabold text-brand-700">{note.date}</span> : null}
                    {note.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor={`status-${interview.id}`}>Status</label>
              <select id={`status-${interview.id}`} className="form-input" value={status} onChange={(event) => setStatus(event.target.value)}>
                {interviewStatuses.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor={`feedback-${interview.id}`}>Feedback</label>
              <textarea id={`feedback-${interview.id}`} className="form-input min-h-[2.75rem] resize-y" value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Panel feedback" maxLength={3000} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <CustomButton variant="secondary" type="button" onClick={() => onReschedule(interview)}>Reschedule</CustomButton>
            <CustomButton type="button" loading={saving} disabled={unchanged} onClick={save}>Update Status</CustomButton>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function InterviewDayModal({ open, dateKey, interviews = [], onClose, onSaved, onReschedule }) {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setExpandedId(interviews.length === 1 ? interviews[0].id : null);
    // Only re-evaluate when the day being viewed changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-shell flex max-h-[86vh] max-w-3xl flex-col">
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">Scheduled Interviews</span>
              <h2 className="modal-title">{formatDayHeading(dateKey)}</h2>
              <p className="modal-subtitle">{interviews.length} interview{interviews.length === 1 ? "" : "s"} on this day</p>
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto">
          {interviews.length ? (
            <div className="grid gap-3">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  expanded={expandedId === interview.id}
                  onToggle={() => setExpandedId(expandedId === interview.id ? null : interview.id)}
                  onSaved={onSaved}
                  onReschedule={onReschedule}
                />
              ))}
            </div>
          ) : <EmptyState title="No interviews scheduled for this day" />}
        </div>
      </div>
    </div>
  );
}
