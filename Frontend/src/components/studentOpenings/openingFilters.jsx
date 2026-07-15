import FilterSelect from "../custom/filterSelect";
import SearchInput from "../custom/searchInput";

export default function OpeningFilters({ search, onSearch, filters, onFilter, onClear, options = {} }) {
  return (
    <div className="app-panel filter-panel">
      <SearchInput className="filter-search" value={search} onChange={onSearch} placeholder="Search company, role, skills" />
      <div className="filter-actions">
        <FilterSelect label="Location" value={filters.location} onChange={(value) => onFilter("location", value)} options={options.location || []} />
        <FilterSelect label="Job type" value={filters.jobType} onChange={(value) => onFilter("jobType", value)} options={options.jobType || []} />
        <FilterSelect label="Category" value={filters.category} onChange={(value) => onFilter("category", value)} options={options.category || ["IT", "Non-IT"]} />
        <button className="secondary-btn shrink-0 self-end" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
