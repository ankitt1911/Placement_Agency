import { Search, X } from "lucide-react";

const splitSearch = (value) => {
  const parts = String(value || "").split("\n");
  return { terms: parts.slice(0, -1).filter(Boolean), draft: parts.at(-1) || "" };
};

const joinSearch = (terms, draft = "") => terms.length ? `${terms.join("\n")}\n${draft}` : draft;

export default function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  const { terms, draft } = splitSearch(value);

  const commitDraft = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const term = draft.trim();
    if (!term) return;
    const nextTerms = terms.some((item) => item.toLowerCase() === term.toLowerCase()) ? terms : [...terms, term];
    onChange(joinSearch(nextTerms));
  };

  const removeTerm = (index) => onChange(joinSearch(terms.filter((_, termIndex) => termIndex !== index), draft));

  return (
    <div className={`relative block w-full ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input
        className="form-input pl-9"
        value={draft}
        onChange={(event) => onChange(joinSearch(terms, event.target.value))}
        onKeyDown={commitDraft}
        placeholder={terms.length ? "Add another search..." : placeholder}
        aria-label={placeholder}
      />
      {terms.length ? (
        <span className="absolute left-0 top-full mt-2 flex max-w-full gap-1 overflow-x-auto">
          {terms.map((term, index) => (
            <span key={`${term}-${index}`} className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-red-100 bg-red-50 px-1.5 py-px text-[9px] font-bold leading-4 text-portal-ink">
              <span>{term}</span>
              <button type="button" className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-red-600 hover:bg-red-100" onClick={() => removeTerm(index)} aria-label={`Remove ${term} search`}>
                <X className="h-2.5 w-2.5" strokeWidth={3} />
              </button>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}
