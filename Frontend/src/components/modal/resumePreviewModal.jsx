import { useEffect, useRef, useState } from "react";
import { Download, FileText, X } from "lucide-react";
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
  // The loader closes over the row, so it changes identity on every parent
  // render; keeping it in a ref lets the effect depend only on the candidate.
  const loadRef = useRef(null);
  loadRef.current = target?.load;
  const targetKey = target?.key || "";

  useEffect(() => {
    if (!targetKey) return undefined;
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
  }, [targetKey]);

  if (!target) return null;

  const confirmDownload = () => {
    downloadBlob(blob, target.fileName);
    onDownloaded?.();
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
          {loading ? (
            <div className="flex h-[62vh] items-center justify-center rounded-2xl border border-portal-border bg-portal-canvas">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-portal-blush border-t-portal-pink" />
                <p className="text-sm font-semibold text-portal-muted">Building resume…</p>
              </div>
            </div>
          ) : null}
          {!loading && error ? (
            <div className="modal-section modal-section-highlight">
              <p className="text-sm font-medium leading-6 text-portal-ink">{error}</p>
            </div>
          ) : null}
          {!loading && !error && url ? (
            <iframe
              title={`${target.title} resume preview`}
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              className="h-[62vh] w-full rounded-2xl border border-portal-border bg-white"
            />
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <CustomButton variant="secondary" onClick={onClose}>Cancel</CustomButton>
            <CustomButton onClick={confirmDownload} disabled={!blob}>
              <Download className="h-4 w-4" /> Download PDF
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
