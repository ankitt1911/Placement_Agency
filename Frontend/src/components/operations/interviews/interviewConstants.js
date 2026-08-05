export const interviewModes = ["Online", "In-Person", "Telephonic"];

// Keys must match the export column keys in Backend/services/opsInterviewService.js.
export const interviewExportColumns = [
  { key: "student", label: "Candidate" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "college", label: "College" },
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "round", label: "Round" },
  { key: "scheduledAt", label: "Scheduled At" },
  { key: "durationMinutes", label: "Duration (min)" },
  { key: "mode", label: "Mode" },
  { key: "status", label: "Status" },
  { key: "interviewerName", label: "Interviewer" },
  { key: "interviewerEmail", label: "Interviewer Email" },
  { key: "meetingLink", label: "Meeting Link" },
  { key: "location", label: "Venue" },
  { key: "feedback", label: "Feedback" },
  { key: "notes", label: "Notes" },
  { key: "scheduledBy", label: "Scheduled By" },
  { key: "updatedBy", label: "Last Updated By" }
];

export const interviewStatuses = ["Scheduled", "Rescheduled", "Completed", "Cancelled", "No Show", "Selected", "Rejected"];

export const interviewStatusTone = {
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  Rescheduled: "border-amber-200 bg-amber-50 text-amber-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-slate-200 bg-slate-100 text-slate-600",
  "No Show": "border-orange-200 bg-orange-50 text-orange-700",
  Selected: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Rejected: "border-red-200 bg-red-50 text-red-700"
};

export const interviewToneClass = (status) => interviewStatusTone[status] || "border-slate-200 bg-slate-100 text-slate-600";

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const toDateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const monthParam = (year, month) => `${year}-${String(month + 1).padStart(2, "0")}`;

// The calendar renders a fixed six-week grid, so the fetch window has to cover the
// trailing days of the previous month and the leading days of the next one. Sending
// explicit local instants also keeps the result correct when the server runs in a
// different timezone than the browser.
export const monthGridRange = (year, month) => {
  const leading = new Date(year, month, 1).getDay();
  const from = new Date(year, month, 1 - leading, 0, 0, 0, 0);
  const to = new Date(year, month, 1 - leading + 41, 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
};

export const splitLocalDateTime = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { date: "", time: "" };
  const pad = (part) => String(part).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
  };
};

export const toIsoDateTime = (date, time) => {
  if (!date || !time) return "";
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
};

export const formatDayHeading = (dateKey) => {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
