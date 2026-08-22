import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Eye, Pencil, UserRound, Trash2 } from "lucide-react";
import { downloadBlob, paginate } from "../../../Utlis/Common/commonMethod";
import { SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import CustomButton from "../../custom/customButton";
import EmptyState from "../../custom/emptyState";
import ExportButton from "../../custom/exportButton";
import FilterSelect from "../../custom/filterSelect";
import Pagination from "../../custom/pagination";
import SearchInput from "../../custom/searchInput";
import StatusBadge from "../../custom/statusBadge";
import PageLoader from "../../loader/PageLoader";
import ConfirmModal from "../../modal/confirmModal";
import DetailModal from "../../modal/detailModal";
import ExportColumnsModal from "./exportColumnsModal";

const actionTone = (label) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("delete") || normalized.includes("reject") || normalized.includes("disable") || normalized.includes("close")) return "listing-action-red";
  if (normalized.includes("schedule") || normalized.includes("interview")) return "listing-action-cyan";
  if (normalized.includes("resume") || normalized.includes("export") || normalized.includes("appl")) return "listing-action-amber";
  if (normalized.includes("select") || normalized.includes("activate") || normalized.includes("enable") || normalized.includes("reopen")) return "listing-action-sky";
  if (normalized.includes("short") || normalized.includes("view")) return "listing-action-blue";
  return "listing-action-purple";
};

const resolveActionValue = (value, row) => typeof value === "function" ? value(row) : value;
const getPrimaryText = (row, columns) => row.role || row.name || row.student || row.company || row[columns[0]?.key] || "Record";
const getSecondaryText = (row) => [row.company, row.college, row.location, row.industry].filter(Boolean).slice(0, 2).join(" • ");
const isMetricValue = (value) => typeof value === "number" || (/^\d+(\.\d+)?$/.test(String(value)) && String(value).length <= 6);
const getProfilePhoto = (row) => row.profilePhoto || row.studentProfile?.profilePhoto || "";

export default function OperationsList({
  title,
  searchPlaceholder,
  columns,
  fetchItems,
  fetchFilterOptions,
  searchKeys,
  filterConfig = [],
  rowDetail,
  detailContent,
  primaryText,
  primaryMeta,
  primaryAction,
  exportAction,
  exportColumns = [],
  editAction,
  statusActions = [],
  deleteAction,
  emptyTitle = "No records found",
  showIdChip = false,
  showProgressBar = false,
  hiddenListKeys = [],
  initialSelectedId,
  selectable = false,
  selectableWhen,
  bulkActions = []
}) {
  const [items, setItems] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [pending, setPending] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [handledInitialSelectedId, setHandledInitialSelectedId] = useState(null);
  const [selectedExportFields, setSelectedExportFields] = useState(() => exportColumns.map((column) => column.key));
  const [checkedIds, setCheckedIds] = useState([]);
  const limit = 10;

  const requestParams = useMemo(() => {
    const params = { limit: 1000 };
    if (search) params.search = search;
    filterConfig.forEach((filter) => {
      const value = filters[filter.key];
      if (value) params[filter.paramKey || filter.key] = value;
    });
    return params;
  }, [search, filters, filterConfig]);

  // Every reload also drops the checked rows: a new search or filter can remove
  // rows the user can no longer see, and acting on those silently is worse than
  // asking them to pick again.
  const loadItems = async (params = requestParams) => {
    setLoading(true);
    try {
      const data = await fetchItems(params);
      setItems(data || []);
      setCheckedIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchFilterOptions) return;
    fetchFilterOptions().then((data) => setFilterOptions(data || {}));
  }, [fetchFilterOptions]);

  useEffect(() => {
    loadItems(requestParams);
    // fetchItems is configured by each page and can be recreated between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchItems, requestParams]);

  const filtered = useMemo(() => {
    if (fetchFilterOptions) return items;
    const terms = search.split("\n").map((term) => term.trim().toLowerCase()).filter(Boolean);
    return items.filter((item) => terms.every((term) => searchKeys.some((key) => String(item[key] || "").toLowerCase().includes(term))));
  }, [items, search, searchKeys, fetchFilterOptions]);

  // Selection spans the whole filtered result set, not just the visible page, so
  // "select all" after a filter means every match and paging keeps the picks.
  const selectableRows = useMemo(
    () => (selectable ? filtered.filter((row) => !selectableWhen || selectableWhen(row)) : []),
    [filtered, selectable, selectableWhen]
  );
  const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);
  const checkedRows = useMemo(() => selectableRows.filter((row) => checkedSet.has(row.id)), [selectableRows, checkedSet]);
  const allChecked = selectableRows.length > 0 && checkedRows.length === selectableRows.length;

  const toggleRow = (row) => setCheckedIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id]);
  const toggleAll = () => setCheckedIds(allChecked ? [] : selectableRows.map((row) => row.id));
  const clearSelection = () => setCheckedIds([]);

  const runConfirm = async () => {
    setPending(true);
    try {
      const result = await confirm.action(confirm.row);
      if (confirm.update) {
        setItems((rows) => confirm.update(rows, confirm.row, result));
      }
      // Bulk actions report a count they only know once the call returns, so the
      // success text may be a function of the result as well as the target rows.
      SuccessMessage(resolveActionValue(confirm.success, result));
      setConfirm(null);
      setCheckedIds([]);
    } finally {
      setPending(false);
    }
  };

  const runExport = async (fields = selectedExportFields) => {
    setExporting(true);
    try {
      const params = fields.length ? { ...requestParams, fields: fields.join(",") } : requestParams;
      const blob = await exportAction(params);
      downloadBlob(blob, `${title.toLowerCase().replaceAll(" ", "-")}.xlsx`);
      SuccessMessage("Export started");
      setExportOpen(false);
    } finally {
      setExporting(false);
    }
  };

  const visible = paginate(filtered, page, limit);

  useEffect(() => {
    if (!initialSelectedId || initialSelectedId === handledInitialSelectedId || loading || selected) return;
    const targetIndex = filtered.findIndex((item) => item.id === initialSelectedId);
    if (targetIndex === -1) return;
    setPage(Math.floor(targetIndex / limit) + 1);
    setSelected(filtered[targetIndex]);
    setHandledInitialSelectedId(initialSelectedId);
  }, [filtered, handledInitialSelectedId, initialSelectedId, loading, selected]);

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-heading">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {primaryAction ? <CustomButton onClick={() => primaryAction.onClick(setItems, loadItems)}>{primaryAction.label}</CustomButton> : null}
          {exportAction ? <ExportButton onClick={() => exportColumns.length ? setExportOpen(true) : runExport([])} loading={exporting} /> : null}
        </div>
      </div>
      <div className="app-panel filter-panel">
        <SearchInput className="filter-search" value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder={searchPlaceholder} />
        <div className="filter-actions">
          {filterConfig.map((filter) => (
            <FilterSelect key={filter.key} label={filter.label} value={filters[filter.key] || ""} options={filterOptions[filter.optionsKey || filter.paramKey || filter.key] || filter.options || []} onChange={(value) => { setFilters({ ...filters, [filter.key]: value }); setPage(1); }} />
          ))}
          <button className="secondary-btn shrink-0 self-end" onClick={() => { setFilters({}); setSearch(""); setPage(1); }}>Clear</button>
        </div>
      </div>
      {selectable && !loading && selectableRows.length ? (
        <div className="app-panel flex flex-wrap items-center gap-3 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-portal-ink">
            <input type="checkbox" className="h-4 w-4 cursor-pointer accent-portal-pink" checked={allChecked} onChange={toggleAll} />
            Select all ({selectableRows.length})
          </label>
          <span className="text-xs font-semibold text-portal-muted">{checkedRows.length} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {bulkActions.map((action) => (
              <button
                key={action.label}
                className={`listing-action ${actionTone(action.label)}`}
                disabled={!checkedRows.length || action.disabled?.(checkedRows)}
                onClick={() => action.onClick
                  ? action.onClick(checkedRows, { clearSelection, reload: loadItems })
                  : setConfirm({
                    row: checkedRows,
                    action: action.run,
                    update: action.update,
                    success: (result) => resolveActionValue(action.success, result) || `${checkedRows.length} updated`,
                    title: action.label,
                    message: resolveActionValue(action.message, checkedRows)
                  })}
              >
                {action.label}<ChevronRight className="h-3.5 w-3.5" />
              </button>
            ))}
            <button className="secondary-btn" disabled={!checkedRows.length} onClick={clearSelection}>Clear</button>
          </div>
        </div>
      ) : null}
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {visible.length ? (
            <div className="grid gap-2">
              {visible.map((row) => {
                const primary = primaryText ? primaryText(row) : getPrimaryText(row, columns);
                const inlineMeta = primaryMeta ? primaryMeta(row) : "";
                const secondary = getSecondaryText(row);
                const profilePhoto = getProfilePhoto(row);
                const details = columns.filter((column) => column.key !== "status" && column.key !== "logo" && !hiddenListKeys.includes(column.key)).slice(0, 6);
                const metrics = columns.filter((column) => column.key !== "status" && isMetricValue(row[column.key])).slice(0, 5);

                return (
                  <article key={row.id} className="listing-row">
                    <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          {selectable ? (
                            <input
                              type="checkbox"
                              className="h-4 w-4 shrink-0 cursor-pointer accent-portal-pink disabled:cursor-not-allowed disabled:opacity-40"
                              checked={checkedSet.has(row.id)}
                              disabled={Boolean(selectableWhen) && !selectableWhen(row)}
                              onChange={() => toggleRow(row)}
                              aria-label={`Select ${primary}`}
                            />
                          ) : null}
                          <span className="listing-icon overflow-hidden">
                            {profilePhoto ? (
                              <img className="h-full w-full object-cover" src={profilePhoto} alt="" />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                          </span>
                          <h2 className="max-w-md truncate text-base font-extrabold text-portal-ink">{primary}</h2>
                          {inlineMeta ? <span className="max-w-xs truncate text-xs font-semibold text-portal-muted">{inlineMeta}</span> : null}
                          {showIdChip && row.id ? <span className="listing-chip">Id: <span className="font-black italic">{row.id}</span></span> : null}
                          {row.status ? <StatusBadge status={row.status} /> : null}
                        </div>
                        {secondary ? <p className="mt-2 pl-11 text-xs font-semibold text-portal-muted">{secondary}</p> : null}
                        <div className="mt-3 flex flex-wrap gap-2 pl-11">
                          {details.map((column) => (
                            <span className="listing-chip" key={column.key}>
                              <span className="text-portal-muted">{column.label}:</span>
                              <span>{String(row[column.key] ?? "-")}</span>
                            </span>
                          ))}
                        </div>
                        {showProgressBar ? (
                          <div className="mt-4 flex items-center gap-2 pl-11">
                            <div className="h-1 flex-1 rounded-full bg-slate-100">
                              <div className="h-full w-0 rounded-full bg-portal-pink" />
                            </div>
                            <span className="text-[10px] font-bold text-portal-muted">0%</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start gap-3 xl:items-end">
                        <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
                          <button className="listing-action listing-action-purple" onClick={() => setSelected(row)}>
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          {editAction ? (
                            <button className="listing-action listing-action-blue" onClick={() => editAction.onClick(row, setItems, loadItems)}>
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                          ) : null}
                          {statusActions.map((action) => {
                            const label = resolveActionValue(action.label, row);
                            return (
                              <button key={label} className={`listing-action ${actionTone(label)}`} disabled={action.disabled?.(row)} onClick={() => action.onClick ? action.onClick(row, setItems, loadItems) : setConfirm({ row, action: action.run, update: action.update, success: resolveActionValue(action.success, row), title: label, message: resolveActionValue(action.message, row) })}>
                                {label}<ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            );
                          })}
                          {deleteAction ? (
                            <button className="listing-action listing-action-red" onClick={() => setConfirm({ row, action: deleteAction.run, update: (rows, target) => rows.filter((item) => item.id !== target.id), success: "Deleted", title: "Delete", message: `Delete ${row.name || row.role || row.student}?` })}>
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          ) : null}
                        </div>
                        {metrics.length ? (
                          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
                            {metrics.map((column) => (
                              <div className="listing-metric" key={column.key}>
                                <p className="text-base font-extrabold text-portal-ink">{row[column.key]}</p>
                                <p className="text-xs font-semibold text-portal-muted">{column.label}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <EmptyState title={emptyTitle} />}
          <Pagination page={page} total={filtered.length} limit={limit} onChange={setPage} />
        </>
      )}
      <DetailModal open={Boolean(selected)} title={selected?.name || selected?.role || selected?.student || title} subtitle={selected?.company} onClose={() => setSelected(null)}>
        {detailContent ? detailContent(selected) : <div className="modal-section modal-detail-grid">{rowDetail(selected)}</div>}
      </DetailModal>
      <ExportColumnsModal
        open={exportOpen}
        title={`${title} Columns`}
        columns={exportColumns}
        selectedFields={selectedExportFields}
        onChange={setSelectedExportFields}
        onClose={() => setExportOpen(false)}
        onExport={() => runExport(selectedExportFields)}
        loading={exporting}
      />
      <ConfirmModal open={Boolean(confirm)} title={confirm?.title} message={confirm?.message} onClose={() => setConfirm(null)} onConfirm={runConfirm} loading={pending} />
    </div>
  );
}
