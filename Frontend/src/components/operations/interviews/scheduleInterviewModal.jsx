import { CalendarClock, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { handleBulkScheduleInterviews, handleScheduleInterview, handleUpdateInterview } from "../../../Services/apiCalling/interviewApis";
import { ErrorMessage, SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import CustomButton from "../../custom/customButton";
import { interviewModes, splitLocalDateTime, toIsoDateTime } from "./interviewConstants";

const emptyForm = { date: "", time: "10:00", durationMinutes: 60, mode: "Online", round: "", meetingLink: "", location: "", interviewerName: "", interviewerEmail: "", note: "", slotMode: "same", gapMinutes: 0 };

const buildForm = (interview) => {
  if (!interview) return emptyForm;
  const { date, time } = splitLocalDateTime(interview.scheduledAt);
  return {
    ...emptyForm,
    date,
    time: time || "10:00",
    durationMinutes: interview.durationMinutes || 60,
    mode: interview.mode || "Online",
    round: interview.round || "",
    meetingLink: interview.meetingLink || "",
    location: interview.location || "",
    interviewerName: interview.interviewerName || "",
    interviewerEmail: interview.interviewerEmail || ""
  };
};

const candidateName = (application) => application?.student || application?.name || "Candidate";

// Staggered slots walk forward by one duration plus the gap, so the nth candidate
// starts once the previous interview and its buffer are over.
const slotAt = (start, index, form) => {
  if (form.slotMode !== "stagger") return start;
  const step = ((Number(form.durationMinutes) || 60) + (Number(form.gapMinutes) || 0)) * 60000;
  return new Date(start.getTime() + index * step);
};

const slotLabel = (date, start) => {
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sameDay = date.toDateString() === start.toDateString();
  return sameDay ? time : `${date.toLocaleDateString([], { day: "numeric", month: "short" })} ${time}`;
};

/**
 * Schedules interviews for one or many applications, or reschedules an existing
 * one when `interview` is supplied. Pass `applications` for the bulk flow.
 */
export default function ScheduleInterviewModal({ open, application, applications, interview, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  const isEdit = Boolean(interview);

  const targets = useMemo(() => {
    if (isEdit) return [];
    if (applications && applications.length) return applications;
    return application ? [application] : [];
  }, [applications, application, isEdit]);

  const included = useMemo(() => targets.filter((target) => !excludedIds.includes(target.id)), [targets, excludedIds]);
  const isBulk = targets.length > 1;

  useEffect(() => {
    if (!open) return;
    setForm(buildForm(interview));
    setExcludedIds([]);
  }, [open, interview]);

  const preview = useMemo(() => {
    const start = form.date && form.time ? new Date(`${form.date}T${form.time}`) : null;
    if (!start || Number.isNaN(start.getTime())) return [];
    return included.map((target, index) => ({ id: target.id, name: candidateName(target), label: slotLabel(slotAt(start, index, form), start) }));
  }, [included, form]);

  if (!open) return null;

  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const reportBulkResult = (result) => {
    if (result.created) SuccessMessage(`${result.created} interview${result.created === 1 ? "" : "s"} scheduled`);
    if (!result.skipped.length) return;
    const nameById = new Map(targets.map((target) => [String(target.id), candidateName(target)]));
    const detail = result.skipped.slice(0, 3).map((item) => `${nameById.get(String(item.application)) || "Applicant"} (${item.reason})`).join(", ");
    ErrorMessage(`${result.skipped.length} skipped: ${detail}${result.skipped.length > 3 ? "…" : ""}`);
  };

  const submit = async (event) => {
    event.preventDefault();
    const scheduledAt = toIsoDateTime(form.date, form.time);
    if (!scheduledAt) return ErrorMessage("Pick a valid interview date and time");
    if (!isEdit && !included.length) return ErrorMessage("Select at least one candidate");

    const payload = {
      scheduledAt,
      durationMinutes: Number(form.durationMinutes) || 60,
      mode: form.mode,
      round: form.round.trim(),
      meetingLink: form.mode === "Online" ? form.meetingLink.trim() : "",
      location: form.mode === "In-Person" ? form.location.trim() : "",
      interviewerName: form.interviewerName.trim(),
      interviewerEmail: form.interviewerEmail.trim(),
      note: form.note.trim()
    };

    setSaving(true);
    try {
      if (isEdit) {
        const saved = await handleUpdateInterview(interview.id, payload);
        SuccessMessage("Interview rescheduled");
        onSaved?.(saved);
      } else if (isBulk) {
        const result = await handleBulkScheduleInterviews({
          ...payload,
          applications: included.map((target) => target.id),
          slotMode: form.slotMode,
          gapMinutes: Number(form.gapMinutes) || 0
        });
        reportBulkResult(result);
        if (!result.created) return;
        onSaved?.(result.data);
      } else {
        const saved = await handleScheduleInterview({ ...payload, application: included[0].id });
        SuccessMessage("Interview scheduled");
        onSaved?.(saved);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const single = isEdit ? interview : included[0];
  const heading = isBulk ? `${included.length} candidate${included.length === 1 ? "" : "s"}` : candidateName(single);
  const subheading = isBulk
    ? "Every selected candidate gets their own interview record"
    : [single?.role, single?.company].filter(Boolean).join(" • ") || "Applied candidate";

  return (
    <div className="modal-backdrop">
      <form className="modal-shell flex max-h-[88vh] max-w-3xl flex-col" onSubmit={submit}>
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">{isEdit ? "Reschedule" : isBulk ? "Bulk Schedule Interviews" : "Schedule Interview"}</span>
              <h2 className="modal-title">{heading}</h2>
              <p className="modal-subtitle">{subheading}</p>
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto">
          {isBulk ? (
            <div className="mb-4 rounded-xl border border-portal-border bg-slate-50 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-portal-muted">Candidates</p>
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                {targets.map((target) => {
                  const dropped = excludedIds.includes(target.id);
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setExcludedIds((current) => dropped ? current.filter((id) => id !== target.id) : [...current, target.id])}
                      title={dropped ? "Add back" : "Remove from this batch"}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${dropped ? "border-slate-200 bg-white text-slate-400 line-through" : "border-portal-border bg-white text-portal-ink hover:border-red-300 hover:text-red-600"}`}
                    >
                      {candidateName(target)}
                      {dropped ? null : <X className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="interview-date">Date</label>
              <input id="interview-date" className="form-input" type="date" value={form.date} onChange={setField("date")} required />
            </div>
            <div>
              <label className="form-label" htmlFor="interview-time">{isBulk && form.slotMode === "stagger" ? "First Slot Time" : "Time"}</label>
              <input id="interview-time" className="form-input" type="time" value={form.time} onChange={setField("time")} required />
            </div>
            <div>
              <label className="form-label" htmlFor="interview-duration">Duration (minutes)</label>
              <input id="interview-duration" className="form-input" type="number" min={5} max={600} value={form.durationMinutes} onChange={setField("durationMinutes")} />
            </div>
            <div>
              <label className="form-label" htmlFor="interview-mode">Mode</label>
              <select id="interview-mode" className="form-input" value={form.mode} onChange={setField("mode")}>
                {interviewModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>
            {isBulk ? (
              <>
                <div>
                  <label className="form-label" htmlFor="interview-slot-mode">Slots</label>
                  <select id="interview-slot-mode" className="form-input" value={form.slotMode} onChange={setField("slotMode")}>
                    <option value="same">Same time for everyone</option>
                    <option value="stagger">Back-to-back slots</option>
                  </select>
                </div>
                {form.slotMode === "stagger" ? (
                  <div>
                    <label className="form-label" htmlFor="interview-gap">Gap Between Slots (minutes)</label>
                    <input id="interview-gap" className="form-input" type="number" min={0} max={600} value={form.gapMinutes} onChange={setField("gapMinutes")} />
                  </div>
                ) : null}
              </>
            ) : null}
            <div>
              <label className="form-label" htmlFor="interview-round">Round</label>
              <input id="interview-round" className="form-input" value={form.round} onChange={setField("round")} placeholder="Technical Round 1" maxLength={120} />
            </div>
            {form.mode === "Online" ? (
              <div>
                <label className="form-label" htmlFor="interview-link">Meeting Link</label>
                <input id="interview-link" className="form-input" value={form.meetingLink} onChange={setField("meetingLink")} placeholder="https://meet.example.com/abc" maxLength={500} />
              </div>
            ) : null}
            {form.mode === "In-Person" ? (
              <div>
                <label className="form-label" htmlFor="interview-location">Venue</label>
                <input id="interview-location" className="form-input" value={form.location} onChange={setField("location")} placeholder="Office address" maxLength={300} />
              </div>
            ) : null}
            <div>
              <label className="form-label" htmlFor="interview-interviewer">Interviewer</label>
              <input id="interview-interviewer" className="form-input" value={form.interviewerName} onChange={setField("interviewerName")} placeholder="Interviewer name" maxLength={140} />
            </div>
            <div>
              <label className="form-label" htmlFor="interview-interviewer-email">Interviewer Email</label>
              <input id="interview-interviewer-email" className="form-input" type="email" value={form.interviewerEmail} onChange={setField("interviewerEmail")} placeholder="interviewer@company.com" maxLength={140} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="interview-note">Note</label>
              <textarea id="interview-note" className="form-input min-h-24 resize-y" value={form.note} onChange={setField("note")} placeholder="Anything the candidate or panel should know" maxLength={1000} />
            </div>
            {isBulk && preview.length ? (
              <div className="sm:col-span-2">
                <p className="form-label">Slot Preview</p>
                <div className="flex max-h-32 flex-col gap-1 overflow-y-auto rounded-xl border border-portal-border bg-slate-50 p-3">
                  {preview.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between gap-3 text-xs font-semibold text-portal-ink">
                      <span className="truncate">{slot.name}</span>
                      <span className="shrink-0 text-portal-muted">{slot.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-portal-border bg-slate-50 px-5 py-4">
          <CustomButton variant="secondary" type="button" onClick={onClose}>Cancel</CustomButton>
          <CustomButton type="submit" loading={saving} disabled={!isEdit && !included.length}>
            {isEdit ? "Save Changes" : isBulk ? `Schedule ${included.length} Interview${included.length === 1 ? "" : "s"}` : "Schedule Interview"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
