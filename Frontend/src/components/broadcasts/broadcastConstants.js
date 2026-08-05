import { AlarmClock, BriefcaseBusiness, CalendarDays, Megaphone, TriangleAlert, Trophy } from "lucide-react";

export const broadcastCategories = ["Announcement", "Drive", "Deadline", "Event", "Achievement", "Alert"];

export const broadcastPriorities = ["Low", "Normal", "High"];

// One entry per category: the icon plus the gradient/accent pair the student
// banner and the operations list both style themselves from.
export const broadcastTheme = {
  Announcement: { icon: Megaphone, gradient: "from-blue-600 via-indigo-600 to-violet-600", glow: "bg-blue-400/40", chip: "border-blue-200 bg-blue-50 text-blue-700" },
  Drive: { icon: BriefcaseBusiness, gradient: "from-cyan-500 via-sky-600 to-blue-600", glow: "bg-cyan-400/40", chip: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  Deadline: { icon: AlarmClock, gradient: "from-amber-500 via-orange-600 to-rose-600", glow: "bg-amber-400/40", chip: "border-amber-200 bg-amber-50 text-amber-700" },
  Event: { icon: CalendarDays, gradient: "from-fuchsia-500 via-purple-600 to-indigo-600", glow: "bg-fuchsia-400/40", chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700" },
  Achievement: { icon: Trophy, gradient: "from-emerald-500 via-teal-600 to-cyan-600", glow: "bg-emerald-400/40", chip: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  Alert: { icon: TriangleAlert, gradient: "from-rose-500 via-red-600 to-orange-600", glow: "bg-rose-400/40", chip: "border-rose-200 bg-rose-50 text-rose-700" }
};

export const themeFor = (category) => broadcastTheme[category] || broadcastTheme.Announcement;

export const broadcastStateTone = {
  Ongoing: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  Expired: "border-slate-200 bg-slate-100 text-slate-600",
  Stopped: "border-red-200 bg-red-50 text-red-700"
};

export const stateToneClass = (state) => broadcastStateTone[state] || broadcastStateTone.Expired;
