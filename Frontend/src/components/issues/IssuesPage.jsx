import { Plus, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import { paginate } from "../../Utlis/Common/commonMethod";
import { handleCreateIssue, handleGetMyIssues, handleGetRaisedIssues, handleUpdateIssueStatus } from "../../Services/apiCalling/issueApis";
import CustomButton from "../custom/customButton";
import EmptyState from "../custom/emptyState";
import FilterSelect from "../custom/filterSelect";
import Pagination from "../custom/pagination";
import SearchInput from "../custom/searchInput";
import StatusBadge from "../custom/statusBadge";
import PageLoader from "../loader/PageLoader";
import IssueModal from "./IssueModal";

const tabs = [
  { key: "my", label: "My Issues" },
  { key: "raised", label: "Raised Issues" },
];

export default function IssuesPage() {
  const { role } = useSelector((state) => state.auth);
  const isOps = role === "operations";
  const [activeTab, setActiveTab] = useState("my");
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "view", issue: null });
  const [pending, setPending] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = useMemo(() => {
    const next = {};
    if (search) next.search = search;
    if (status) next.status = status;
    return next;
  }, [search, status]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = activeTab === "raised" && isOps ? await handleGetRaisedIssues(params) : await handleGetMyIssues(params);
      setIssues(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, params, isOps]);

  const visible = paginate(issues, page, limit);

  const createIssue = async (form) => {
    setPending(true);
    try {
      const created = await handleCreateIssue(form);
      SuccessMessage("Issue raised successfully");
      setModal({ open: false, mode: "view", issue: null });
      if (activeTab === "my") setIssues((rows) => [created, ...rows]);
      else loadIssues();
    } finally {
      setPending(false);
    }
  };

  const updateStatus = async (issue, nextStatus) => {
    setPending(true);
    try {
      const updated = await handleUpdateIssueStatus(issue.id, nextStatus);
      SuccessMessage("Issue status updated");
      setIssues((rows) => rows.map((item) => item.id === updated.id ? updated : item));
      setModal({ open: true, mode: "view", issue: updated });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-heading">Raise An Issue</h1>
        <CustomButton onClick={() => setModal({ open: true, mode: "create", issue: null })}>
          <Plus className="h-4 w-4" /> New Issue
        </CustomButton>
      </div>

      {isOps ? (
        <div className="app-panel flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`secondary-btn ${activeTab === tab.key ? "border-brand-100 bg-brand-50 text-brand-700" : ""}`}
              type="button"
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="app-panel filter-panel">
        <SearchInput className="filter-search" value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search issues" />
        <div className="filter-actions">
          <FilterSelect label="Status" value={status} options={["Open", "Closed"]} onChange={(value) => { setStatus(value); setPage(1); }} />
          <button className="secondary-btn shrink-0 self-end" onClick={() => { setSearch(""); setStatus(""); setPage(1); }}>Clear</button>
        </div>
      </div>

      {loading ? <PageLoader /> : visible.length ? (
        <div className="grid gap-2">
          {visible.map((issue) => (
            <article key={issue.id} className="listing-row">
              <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="listing-icon"><Ticket className="h-4 w-4" /></span>
                    <h2 className="max-w-xl truncate text-base font-extrabold text-portal-ink">{issue.subject}</h2>
                    <StatusBadge status={issue.status} />
                    <span className="listing-chip">{issue.priority} Priority</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pl-11">
                    {isOps && activeTab === "raised" ? <span className="listing-chip"><span className="text-portal-muted">Raised By:</span><span>{issue.raisedByName || "-"}</span></span> : null}
                    <span className="listing-chip"><span className="text-portal-muted">Created:</span><span>{issue.createdDate || "-"}</span></span>
                    <span className="listing-chip"><span className="text-portal-muted">Updated:</span><span>{issue.updatedDate || "-"}</span></span>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <button className="listing-action listing-action-purple" onClick={() => setModal({ open: true, mode: "view", issue })}>
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : <EmptyState title="No issues found" />}

      <Pagination page={page} total={issues.length} limit={limit} onChange={setPage} />
      <IssueModal
        open={modal.open}
        mode={modal.mode}
        issue={modal.issue}
        canUpdateStatus={isOps && activeTab === "raised" && modal.mode === "view"}
        onClose={() => setModal({ open: false, mode: "view", issue: null })}
        onSubmit={createIssue}
        onStatusChange={updateStatus}
        loading={pending}
      />
    </div>
  );
}
