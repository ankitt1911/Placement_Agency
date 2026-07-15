import { FileText, Image } from "lucide-react";
import FileUpload from "../custom/fileUpload";

export default function ResumeDocumentsForm({ uploads, onUpload }) {
  const uploadedCount = [uploads.resume, uploads.profilePhoto].filter(Boolean).length;
  const completion = Math.round((uploadedCount / 2) * 100);

  return (
    <section className="profile-card">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-portal-border pb-4">
        <div className="flex gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-sm">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="section-title">Resume & Documents</h2>
            <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-portal-muted">Upload the latest files used by placement teams and recruiters.</p>
          </div>
        </div>
        <div className="min-w-[8rem] rounded-lg border border-portal-border bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-portal-muted">Files</span>
            <span className="text-xs font-extrabold text-brand-700">{completion}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FileUpload icon={FileText} label="Resume Upload" accept=".pdf,.doc,.docx" helper={uploads.resume || "PDF/DOC/DOCX"} onChange={(file) => onUpload("resume", file)} />
        <FileUpload icon={Image} label="Profile Photo" accept=".jpg,.jpeg,.png,.webp" helper={uploads.profilePhoto || "JPG/PNG/WEBP"} onChange={(file) => onUpload("profilePhoto", file)} />
      </div>
    </section>
  );
}
