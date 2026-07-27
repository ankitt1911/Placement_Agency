import { useEffect, useState } from "react";
import { handleGetApplicationDetails, handleGetStudentApplicationFilterOptions, handleGetStudentApplications, handleWithdrawApplication } from "../../Services/apiCalling/jobApis";
import { paginate } from "../../Utlis/Common/commonMethod";
import { SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import EmptyState from "../custom/emptyState";
import Pagination from "../custom/pagination";
import PageLoader from "../loader/PageLoader";
import DetailModal from "../modal/detailModal";
import OpeningDetails from "../studentOpenings/openingDetails";
import AppliedJobCard from "./appliedJobCard";
import AppliedJobFilters from "./appliedJobFilters";
import WithdrawApplicationModal from "./withdrawApplicationModal";

export default function StudentAppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [company, setCompany] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const limit = 5;

  useEffect(() => {
    handleGetStudentApplicationFilterOptions().then((data) => setFilterOptions(data || {}));
  }, []);

  useEffect(() => {
    setLoading(true);
    handleGetStudentApplications({ search, status, company, limit: 1000 }).then((data) => setApplications(data || [])).finally(() => setLoading(false));
  }, [company, search, status]);

  const withdraw = async () => {
    setWithdrawing(true);
    try {
      await handleWithdrawApplication({ applicationId: withdrawTarget.id });
      setApplications((items) => items.map((item) => (item.id === withdrawTarget.id ? { ...item, status: "Withdrawn", timeline: [...item.timeline, "Withdrawn"] } : item)));
      setWithdrawTarget(null);
      SuccessMessage("Application withdrawn");
    } finally {
      setWithdrawing(false);
    }
  };

  const viewDetails = async (application) => {
    setSelected(application);
    setDetailsLoading(true);
    try {
      const detail = await handleGetApplicationDetails(application.id);
      setSelected(detail?.id ? detail : application);
    } finally {
      setDetailsLoading(false);
    }
  };

  const visible = paginate(applications, page, limit);

  return (
    <div className="page-shell">
      <h1 className="page-heading">Applied Jobs</h1>
      <AppliedJobFilters search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} company={company} options={filterOptions} onStatus={(value) => { setStatus(value); setPage(1); }} onCompany={(value) => { setCompany(value); setPage(1); }} onClear={() => { setSearch(""); setStatus(""); setCompany(""); setPage(1); }} />
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {visible.length ? <div className="grid gap-4">{visible.map((item) => <AppliedJobCard key={item.id} application={item} onDetails={viewDetails} onWithdraw={setWithdrawTarget} />)}</div> : <EmptyState title="No applied jobs found" />}
          <Pagination page={page} total={applications.length} limit={limit} onChange={setPage} />
        </>
      )}
      <DetailModal open={Boolean(selected)} title={selected?.role} subtitle={selected?.company} onClose={() => setSelected(null)}>
        {detailsLoading ? <div className="py-10 text-center text-sm font-semibold text-portal-muted">Loading opening details...</div> : <OpeningDetails opening={selected?.opening} />}
      </DetailModal>
      <WithdrawApplicationModal open={Boolean(withdrawTarget)} application={withdrawTarget} onClose={() => setWithdrawTarget(null)} onConfirm={withdraw} loading={withdrawing} />
    </div>
  );
}
