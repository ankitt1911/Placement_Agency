import { CalendarClock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { handleScheduleInterview, handleUpdateInterview } from "../../../Services/apiCalling/interviewApis";
import { ErrorMessage, SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import CustomButton from "../../custom/customButton";
import { interviewModes, splitLocalDateTime, toIsoDateTime } from "./interviewConstants";

const emptyForm = { date: "", time: "10:00", durationMinutes: 60, mode: "Online", round: "", meetingLink: "", location: "", interviewerName: "", interviewerEmail: "", note: "" };

const buildForm = (interview) => {
  if (!interview) return emptyForm;
  const { date, time } = splitLocalDateTime(interview.scheduledAt);
  return {
    date,
    time: time || "10:00",
    durationMinutes: interview.durationMinutes || 60,
    mode: interview.mode || "Online",
    round: interview.round || "",
    meetingLink: interview.meetingLink || "",
    location: interview.location || "",
    interviewerName: interview.interviewerName || "",
    interviewerEmail: interview.interviewerEmail || "",
    note: ""
  };
};

/**
 * Schedules a new interview for an application, or reschedules an existing one
 * when `interview` is supplied.
 */
export default function ScheduleInterviewModal({ open, application, interview, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(interview);

  useEffect(() => {
    if (open) setForm(buildForm(interview));
  }, [open, interview]);

  if (!open) return null;

  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const scheduledAt = toIsoDateTime(form.date, form.time);
    if (!scheduledAt) return ErrorMessage("Pick a valid interview date and time");

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
      const saved = isEdit
        ? await handleUpdateInterview(interview.id, payload)
        : await handleScheduleInterview({ ...payload, application: application.id });
      SuccessMessage(isEdit ? "Interview rescheduled" : "Interview scheduled");
      onSaved?.(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const candidate = interview?.student || application?.student || "Candidate";
  const role = interview?.role || application?.role || "";
  const company = interview?.company || application?.company || "";

  return (
    <div className="modal-backdrop">
      <form className="modal-shell flex max-h-[88vh] max-w-3xl flex-col" onSubmit={submit}>
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">{isEdit ? "Reschedule" : "Schedule Interview"}</span>
              <h2 className="modal-title">{candidate}</h2>
              <p className="modal-subtitle">{[role, company].filter(Boolean).join(" • ") || "Applied candidate"}</p>
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="interview-date">Date</label>
              <input id="interview-date" className="form-input" type="date" value={form.date} onChange={setField("date")} required />
            </div>
            <div>
              <label className="form-label" htmlFor="interview-time">Time</label>
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
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-portal-border bg-slate-50 px-5 py-4">
          <CustomButton variant="secondary" type="button" onClick={onClose}>Cancel</CustomButton>
          <CustomButton type="submit" loading={saving}>{isEdit ? "Save Changes" : "Schedule Interview"}</CustomButton>
        </div>
      </form>
    </div>
  );
}
