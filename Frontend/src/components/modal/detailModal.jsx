import { Info, X } from "lucide-react";

export default function DetailModal({ open, title, subtitle, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-shell flex max-h-[86vh] max-w-3xl flex-col">
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <Info className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">Details</span>
              <h2 className="modal-title">{title}</h2>
              {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
