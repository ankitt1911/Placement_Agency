import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { handleApplyToOpening, handleGetOpeningDetails, handleGetOpeningFilterOptions, handleGetOpenings } from "../../Services/apiCalling/jobApis";
import { paginate } from "../../Utlis/Common/commonMethod";
import { SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import EmptyState from "../custom/emptyState";
import Pagination from "../custom/pagination";
import DetailModal from "../modal/detailModal";
import PageLoader from "../loader/PageLoader";
import ApplyJobModal from "./applyJobModal";
import OpeningCard from "./openingCard";
import OpeningDetails from "./openingDetails";
import OpeningFilters from "./openingFilters";

export default function StudentOpenings() {
  const location = useLocation();
  const [openings, setOpenings] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ location: "", jobType: "", category: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [applyTarget, setApplyTarget] = useState(null);
  const [applying, setApplying] = useState(false);
  const [handledInitialOpeningId, setHandledInitialOpeningId] = useState(null);
  const initialOpeningId = location.state?.openingId;
  const limit = 5;

  useEffect(() => {
    handleGetOpeningFilterOptions().then((data) => setFilterOptions(data || {}));
  }, []);

  useEffect(() => {
    setLoading(true);
    handleGetOpenings({ search, ...filters, limit: 1000 }).then((data) => setOpenings(data || [])).finally(() => setLoading(false));
  }, [search, filters]);

  const apply = async () => {
    setApplying(true);
    try {
      await handleApplyToOpening({ openingId: applyTarget.id });
      setOpenings((items) => items.map((item) => (item.id === applyTarget.id ? { ...item, applied: true } : item)));
      setApplyTarget(null);
      SuccessMessage("Application submitted");
    } finally {
      setApplying(false);
    }
  };

  const viewDetails = async (opening) => {
    setSelected(opening);
    setDetailsLoading(true);
    try {
      const detail = await handleGetOpeningDetails(opening.id);
      setSelected(detail?.id ? detail : opening);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialOpeningId || initialOpeningId === handledInitialOpeningId || loading || selected) return;
    const targetIndex = openings.findIndex((item) => item.id === initialOpeningId);
    if (targetIndex === -1) return;
    setPage(Math.floor(targetIndex / limit) + 1);
    setHandledInitialOpeningId(initialOpeningId);
    viewDetails(openings[targetIndex]);
  }, [handledInitialOpeningId, initialOpeningId, loading, openings, selected]);

  const visible = paginate(openings, page, limit);

  return (
    <div className="page-shell">
      <h1 className="page-heading">Openings</h1>
      <OpeningFilters search={search} onSearch={(value) => { setSearch(value); setPage(1); }} filters={filters} options={filterOptions} onFilter={(field, value) => { setFilters({ ...filters, [field]: value }); setPage(1); }} onClear={() => { setFilters({ location: "", jobType: "", category: "" }); setSearch(""); setPage(1); }} />
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {visible.length ? <div className="grid gap-4">{visible.map((item) => <OpeningCard key={item.id} opening={item} onDetails={viewDetails} onApply={setApplyTarget} />)}</div> : <EmptyState title="No openings found" />}
          <Pagination page={page} total={openings.length} limit={limit} onChange={setPage} />
        </>
      )}
      <DetailModal open={Boolean(selected)} title={selected?.role} subtitle={selected?.company} onClose={() => setSelected(null)}>
        {detailsLoading ? <div className="py-10 text-center text-sm font-semibold text-portal-muted">Loading opening details...</div> : <OpeningDetails opening={selected} />}
      </DetailModal>
      <ApplyJobModal open={Boolean(applyTarget)} opening={applyTarget} onClose={() => setApplyTarget(null)} onConfirm={apply} loading={applying} />
    </div>
  );
}
