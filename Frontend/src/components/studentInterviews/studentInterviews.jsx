import { useEffect, useMemo, useState } from "react";
import { handleGetMyInterviews } from "../../Services/apiCalling/interviewApis";
import { paginate } from "../../Utlis/Common/commonMethod";
import EmptyState from "../custom/emptyState";
import FilterSelect from "../custom/filterSelect";
import Pagination from "../custom/pagination";
import SearchInput from "../custom/searchInput";
import PageLoader from "../loader/PageLoader";
import { interviewStatuses } from "../operations/interviews/interviewConstants";
import StudentInterviewCard from "./interviewCard";

const upcomingStatuses = ["Scheduled", "Rescheduled"];
const isUpcoming = (interview) => upcomingStatuses.includes(interview.status) && new Date(interview.scheduledAt) >= new Date();

export default function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    setLoading(true);
    handleGetMyInterviews().then((data) => setInterviews(data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const terms = search.split("\n").map((term) => term.trim().toLowerCase()).filter(Boolean);
    return interviews
      .filter((interview) => !status || interview.status === status)
      .filter((interview) => terms.every((term) => ["company", "role", "round", "interviewerName", "mode"].some((key) => String(interview[key] || "").toLowerCase().includes(term))));
  }, [interviews, search, status]);

  // Upcoming interviews first (soonest at the top), then everything else most recent first.
  const ordered = useMemo(() => {
    const upcoming = filtered.filter(isUpcoming).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    const rest = filtered.filter((interview) => !isUpcoming(interview)).sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
    return [...upcoming, ...rest];
  }, [filtered]);

  const upcomingCount = interviews.filter(isUpcoming).length;
  const visible = paginate(ordered, page, limit);

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-heading">Interviews</h1>
        <span className="listing-chip">
          <span className="text-portal-muted">Upcoming:</span>
          <span>{upcomingCount}</span>
        </span>
      </div>
      <p className="text-sm font-semibold text-portal-muted">Interviews scheduled for you by the placement team.</p>
      <div className="app-panel filter-panel">
        <SearchInput className="filter-search" value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search company, role, round" />
        <div className="filter-actions">
          <FilterSelect label="Status" value={status} options={interviewStatuses} onChange={(value) => { setStatus(value); setPage(1); }} />
          <button className="secondary-btn shrink-0 self-end" type="button" onClick={() => { setSearch(""); setStatus(""); setPage(1); }}>Clear</button>
        </div>
      </div>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {visible.length ? (
            <div className="grid gap-4">
              {visible.map((interview) => <StudentInterviewCard key={interview.id} interview={interview} />)}
            </div>
          ) : <EmptyState title="No interviews scheduled yet" message="You will see an interview here once the placement team schedules one." />}
          <Pagination page={page} total={ordered.length} limit={limit} onChange={setPage} />
        </>
      )}
    </div>
  );
}
