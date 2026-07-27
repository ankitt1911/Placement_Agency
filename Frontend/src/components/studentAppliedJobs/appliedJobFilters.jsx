import FilterSelect from "../custom/filterSelect";
import SearchInput from "../custom/searchInput";

export default function AppliedJobFilters({ search, onSearch, status, company, onStatus, onCompany, onClear, options = {} }) {
  return (
    <div className="app-panel filter-panel">
      <SearchInput className="filter-search" value={search} onChange={onSearch} placeholder="Search company, role, location, status" />
      <div className="filter-actions">
        <FilterSelect label="Company" value={company} onChange={onCompany} options={options.company || []} />
        <FilterSelect label="Status" value={status} onChange={onStatus} options={options.status || []} />
        <button className="secondary-btn shrink-0 self-end" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
