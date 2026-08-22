import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, FileText, Wand2, X } from "lucide-react";
import { downloadBlob } from "../../Utlis/Common/commonMethod";
import CustomButton from "../custom/customButton";

// `target` carries everything the modal needs for one candidate:
// { key, title, subtitle, fileName, load }. It doubles as the open flag, so the
// caller opens the preview simply by setting a target and closes it with null.
export default function ResumePreviewModal({ target, onClose, onDownloaded }) {
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("choice");
  // The loader closes over the row, so it changes identity on every parent
  // render; keeping it in a ref lets the effect depend only on the candidate.
  const loadRef = useRef(null);
  loadRef.current = target?.load;
  const targetKey = target?.key || "";

  useEffect(() => {
    setMode("choice");
    setBlob(null);
    setUrl("");
    setError("");
  }, [targetKey]);

  useEffect(() => {
    if (!targetKey || mode !== "generate") return undefined;
    let active = true;
    let objectUrl = "";
    setLoading(true);
    setError("");
    setBlob(null);
    setUrl("");
    loadRef.current()
      .then((result) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(result);
        setBlob(result);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (active) setError("Resume could not be generated for this candidate.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [targetKey, mode]);

  if (!target) return null;

  const confirmDownload = () => {
    downloadBlob(blob, target.fileName);
    onDownloaded?.();
    onClose();
  };

  const openUploadedResume = () => {
    if (!target.uploadedResumeUrl) return;
    globalThis.open(target.uploadedResumeUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-shell flex max-h-[92vh] w-full max-w-4xl flex-col">
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">Resume Preview</span>
              <h2 className="modal-title">{target.title}</h2>
              <p className="modal-subtitle">{target.subtitle || "Review the generated resume before downloading."}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto">
          {mode === "choice" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-left transition hover:border-brand-300 hover:bg-white hover:shadow-sm"
                onClick={() => setMode("generate")}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <Wand2 className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-base font-extrabold text-portal-ink">Generate Resume</span>
                <span className="mt-2 block text-sm font-medium leading-6 text-portal-muted">Build and preview a PDF from the student profile.</span>
              </button>
              <button
                className="rounded-xl border border-portal-border bg-slate-50 p-5 text-left transition enabled:hover:border-brand-300 enabled:hover:bg-white enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-55"
                onClick={openUploadedResume}
                disabled={!target.uploadedResumeUrl}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <ExternalLink className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-base font-extrabold text-portal-ink">Open Uploaded Resume Link</span>
                <span className="mt-2 block text-sm font-medium leading-6 text-portal-muted">{target.uploadedResumeUrl ? "Open the student's saved resume link in a new tab." : "No uploaded resume link is saved for this candidate."}</span>
              </button>
            </div>
          ) : null}
          {mode === "generate" && loading ? (
            <div className="flex h-[62vh] items-center justify-center rounded-2xl border border-portal-border bg-portal-canvas">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-portal-blush border-t-portal-pink" />
                <p className="text-sm font-semibold text-portal-muted">Building resume…</p>
              </div>
            </div>
          ) : null}
          {mode === "generate" && !loading && error ? (
            <div className="modal-section modal-section-highlight">
              <p className="text-sm font-medium leading-6 text-portal-ink">{error}</p>
            </div>
          ) : null}
          {mode === "generate" && !loading && !error && url ? (
            <iframe
              title={`${target.title} resume preview`}
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              className="h-[62vh] w-full rounded-2xl border border-portal-border bg-white"
            />
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <CustomButton variant="secondary" onClick={onClose}>Cancel</CustomButton>
            {mode === "generate" ? <CustomButton onClick={confirmDownload} disabled={!blob}>
              <Download className="h-4 w-4" /> Download PDF
            </CustomButton> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
