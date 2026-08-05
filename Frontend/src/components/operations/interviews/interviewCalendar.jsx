import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleExportInterviewsExcel, handleGetInterviewFilterOptions, handleGetInterviews } from "../../../Services/apiCalling/interviewApis";
import { downloadBlob } from "../../../Utlis/Common/commonMethod";
import { SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import ExportButton from "../../custom/exportButton";
import FilterSelect from "../../custom/filterSelect";
import SearchInput from "../../custom/searchInput";
import ExportColumnsModal from "../shared/exportColumnsModal";
import InterviewDayModal from "./interviewDayModal";
import ScheduleInterviewModal from "./scheduleInterviewModal";
import { interviewExportColumns, interviewModes, interviewStatuses, interviewToneClass, monthGridRange, monthNames, monthParam, toDateKey, weekdayNames } from "./interviewConstants";

const todayKey = () => {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
};

// Six-week grid so the layout height never jumps between months.
const buildCells = (year, month) => {
  const leading = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - leading);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return {
      dateKey: toDateKey(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      inMonth: date.getMonth() === month && date.getFullYear() === year
    };
  });
};

export default function InterviewCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState({});
  const [exporting, setExporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedExportFields, setSelectedExportFields] = useState(() => interviewExportColumns.map((column) => column.key));
  const [selectedDay, setSelectedDay] = useState(null);
  const [rescheduling, setRescheduling] = useState(null);

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    try {
      setInterviews(await handleGetInterviews(monthGridRange(year, month)));
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  // Options span every interview, not just the visible month, so the dropdowns
  // do not reshuffle as the user pages through months.
  useEffect(() => {
    handleGetInterviewFilterOptions().then((data) => setFilterOptions(data || {}));
  }, []);

  const filtered = useMemo(() => {
    const terms = search.split("\n").map((term) => term.trim().toLowerCase()).filter(Boolean);
    return interviews
      .filter((interview) => !statusFilter || interview.status === statusFilter)
      .filter((interview) => !modeFilter || interview.mode === modeFilter)
      .filter((interview) => !companyFilter || interview.companyId === companyFilter)
      .filter((interview) => !roleFilter || interview.role === roleFilter)
      .filter((interview) => terms.every((term) => ["student", "email", "company", "role", "round", "interviewerName"].some((key) => String(interview[key] || "").toLowerCase().includes(term))));
  }, [interviews, search, statusFilter, modeFilter, companyFilter, roleFilter]);

  const runExport = async (fields = selectedExportFields) => {
    setExporting(true);
    try {
      const params = { ...monthGridRange(year, month), tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
      if (fields.length) params.fields = fields.join(",");
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (modeFilter) params.mode = modeFilter;
      if (companyFilter) params.company = companyFilter;
      if (roleFilter) params.role = roleFilter;
      downloadBlob(await handleExportInterviewsExcel(params), `interviews-${monthParam(year, month)}.xlsx`);
      SuccessMessage("Export started");
      setExportOpen(false);
    } finally {
      setExporting(false);
    }
  };

  const byDate = useMemo(() => {
    const grouped = new Map();
    filtered.forEach((interview) => {
      if (!interview.dateKey) return;
      grouped.set(interview.dateKey, [...(grouped.get(interview.dateKey) || []), interview]);
    });
    grouped.forEach((list) => list.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)));
    return grouped;
  }, [filtered]);

  const cells = useMemo(() => buildCells(year, month), [year, month]);
  const monthPrefix = monthParam(year, month);
  const monthCount = filtered.filter((interview) => interview.dateKey.startsWith(monthPrefix)).length;
  const today = todayKey();
  const yearOptions = Array.from({ length: 7 }, (_, index) => String(now.getFullYear() - 2 + index));

  const shiftMonth = (step) => {
    const shifted = new Date(year, month + step, 1);
    setYear(shifted.getFullYear());
    setMonth(shifted.getMonth());
  };

  const goToday = () => {
    const current = new Date();
    setYear(current.getFullYear());
    setMonth(current.getMonth());
  };

  const applySaved = (saved) => {
    setInterviews((current) => current.map((interview) => interview.id === saved.id ? saved : interview));
    // A reschedule can push the interview outside the loaded window, so re-sync from the server.
    if (saved.dateKey && !cells.some((cell) => cell.dateKey === saved.dateKey)) loadInterviews();
  };

  const selectedInterviews = selectedDay ? byDate.get(selectedDay) || [] : [];

  return (
    // The whole page is height-constrained so the six-week grid always fits the
    // viewport without the day cells pushing the page into a vertical scroll.
    <div className="flex h-full min-h-0 flex-col gap-2.5 px-4 py-3 sm:px-6">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-normal text-portal-ink">Interviews</h1>
          <span className="listing-chip">
            <span className="text-portal-muted">{monthNames[month]} {year}:</span>
            <span>{monthCount} scheduled</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden flex-wrap gap-1 xl:flex">
            {interviewStatuses.map((status) => (
              <span key={status} className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold ${interviewToneClass(status)}`}>{status}</span>
            ))}
          </div>
          <ExportButton onClick={() => setExportOpen(true)} loading={exporting} />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-portal-border bg-white px-3 py-2 shadow-[0_2px_7px_rgba(38,57,91,0.08)]">
        <div className="flex flex-wrap items-center gap-2">
          <button className="secondary-btn px-2.5 py-1.5" type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <select className="form-input w-36 py-1.5" value={month} aria-label="Month" onChange={(event) => setMonth(Number(event.target.value))}>
            {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
          </select>
          <select className="form-input w-24 py-1.5" value={year} aria-label="Year" onChange={(event) => setYear(Number(event.target.value))}>
            {yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <button className="secondary-btn px-2.5 py-1.5" type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="secondary-btn px-2.5 py-1.5" type="button" onClick={goToday}>Today</button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[13rem]">
            <SearchInput value={search} onChange={setSearch} placeholder="Search candidate, company, role" />
          </div>
          <FilterSelect label="Company" value={companyFilter} options={filterOptions.company || []} onChange={setCompanyFilter} />
          <FilterSelect label="Role" value={roleFilter} options={filterOptions.role || []} onChange={setRoleFilter} />
          <FilterSelect label="Status" value={statusFilter} options={interviewStatuses} onChange={setStatusFilter} />
          <FilterSelect label="Mode" value={modeFilter} options={interviewModes} onChange={setModeFilter} />
          <button className="secondary-btn shrink-0 px-2.5 py-1.5" type="button" onClick={() => { setSearch(""); setStatusFilter(""); setModeFilter(""); setCompanyFilter(""); setRoleFilter(""); }}>Clear</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-portal-border bg-white p-2 shadow-[0_2px_7px_rgba(38,57,91,0.08)]">
        {loading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          </div>
        ) : (
          <>
            <div className="grid shrink-0 grid-cols-7 gap-1 pb-1">
              {weekdayNames.map((name) => (
                <div key={name} className="text-center text-[10px] font-extrabold uppercase tracking-wide text-portal-muted">{name}</div>
              ))}
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1">
              {cells.map((cell) => {
                const dayInterviews = byDate.get(cell.dateKey) || [];
                const isToday = cell.dateKey === today;
                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedDay(cell.dateKey)}
                    className={`flex min-h-0 flex-col overflow-hidden rounded-lg border p-1 text-left transition hover:border-brand-100 hover:shadow-md ${cell.inMonth ? "border-portal-border bg-white" : "border-slate-100 bg-slate-50/70"} ${isToday ? "ring-2 ring-brand-600" : ""}`}
                  >
                    <span className="flex shrink-0 items-center justify-between gap-1">
                      <span className={`text-[11px] font-extrabold leading-none ${cell.inMonth ? "text-portal-ink" : "text-slate-400"}`}>{cell.day}</span>
                      {dayInterviews.length ? (
                        <span className="rounded-full bg-brand-600 px-1.5 text-[9px] font-bold leading-4 text-white">{dayInterviews.length}</span>
                      ) : null}
                    </span>
                    {/* Clipped rather than scrolled: the count badge above always shows the true total. */}
                    <span className="mt-0.5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                      {dayInterviews.map((interview) => (
                        <span key={interview.id} className={`shrink-0 truncate rounded border px-1 text-[9px] font-bold leading-4 ${interviewToneClass(interview.status)}`}>
                          {interview.timeLabel} {interview.student}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <InterviewDayModal
        open={Boolean(selectedDay)}
        dateKey={selectedDay}
        interviews={selectedInterviews}
        onClose={() => setSelectedDay(null)}
        onSaved={applySaved}
        onReschedule={(interview) => setRescheduling(interview)}
      />
      <ScheduleInterviewModal
        open={Boolean(rescheduling)}
        interview={rescheduling}
        onClose={() => setRescheduling(null)}
        onSaved={applySaved}
      />
      <ExportColumnsModal
        open={exportOpen}
        title="Interview Columns"
        subtitle="Choose the interview columns to include."
        allLabel="All interview columns"
        columns={interviewExportColumns}
        selectedFields={selectedExportFields}
        onChange={setSelectedExportFields}
        onClose={() => setExportOpen(false)}
        onExport={() => runExport(selectedExportFields)}
        loading={exporting}
      />
    </div>
  );
}
