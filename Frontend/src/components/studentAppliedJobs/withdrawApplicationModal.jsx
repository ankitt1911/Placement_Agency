import ConfirmModal from "../modal/confirmModal";

export default function WithdrawApplicationModal({ application, open, onClose, onConfirm, loading }) {
  return <ConfirmModal open={open} title="Withdraw application" message={`Withdraw application for ${application?.role || "this job"}?`} confirmLabel="Withdraw" onClose={onClose} onConfirm={onConfirm} loading={loading} />;
}
