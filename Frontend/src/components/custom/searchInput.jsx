import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <label className={`relative block w-full ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input className="form-input pl-9" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
