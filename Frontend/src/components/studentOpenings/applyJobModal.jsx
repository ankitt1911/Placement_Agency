import ConfirmModal from "../modal/confirmModal";

export default function ApplyJobModal({ opening, open, onClose, onConfirm, loading }) {
  return <ConfirmModal open={open} title="Apply to opening" message={`Submit your application for ${opening?.role || "this opening"}?`} confirmLabel="Apply" onClose={onClose} onConfirm={onConfirm} loading={loading} />;
}
