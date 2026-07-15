import { AlertCircle, X } from "lucide-react";
import CustomButton from "../custom/customButton";

export default function ConfirmModal({ open, title, message, confirmLabel = "Confirm", onConfirm, onClose, loading }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-shell max-w-md">
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon modal-header-icon-danger">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">Confirmation</span>
              <h2 className="modal-title">{title}</h2>
              <p className="modal-subtitle">Please review this action before continuing.</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-section modal-section-highlight">
            <p className="text-sm font-medium leading-6 text-portal-ink">{message}</p>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <CustomButton variant="secondary" onClick={onClose}>Cancel</CustomButton>
            <CustomButton variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
