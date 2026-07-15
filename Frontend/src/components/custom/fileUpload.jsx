import { UploadCloud } from "lucide-react";

export default function FileUpload({ label, accept, onChange, helper, icon: Icon = UploadCloud }) {
  return (
    <label className="block rounded-xl border border-dashed border-brand-100 bg-slate-50/80 p-4 transition hover:border-brand-300 hover:bg-white hover:shadow-sm">
      <span className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-portal-ink">{label}</span>
          {helper ? <span className="mt-1 block truncate text-xs font-medium text-portal-muted">{helper}</span> : null}
        </span>
      </span>
      <input className="mt-4 w-full text-sm text-portal-muted file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700" type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0])} />
    </label>
  );
}
