import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import CustomButton from "../custom/customButton";
import StatusBadge from "../custom/statusBadge";

const emptyForm = { subject: "", description: "", priority: "Medium" };
const priorities = ["Low", "Medium", "High"];

export default function IssueModal({ open, mode = "view", issue, canUpdateStatus = false, onClose, onSubmit, onStatusChange, loading = false }) {
  const [form, setForm] = useState(emptyForm);
  const isCreate = mode === "create";

  useEffect(() => {
    setForm(isCreate ? emptyForm : {
      subject: issue?.subject || "",
      description: issue?.description || "",
      priority: issue?.priority || "Medium"
    });
  }, [isCreate, issue, open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (isCreate) onSubmit(form);
  };

  const nextStatus = issue?.status === "Closed" ? "Open" : "Closed";

  return (
    <div className="modal-backdrop">
      <form className="modal-shell flex max-h-[88vh] max-w-3xl flex-col" onSubmit={submit}>
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">{isCreate ? "Raise Issue" : "Issue Details"}</span>
              <h2 className="modal-title">{isCreate ? "Create New Issue" : issue?.subject}</h2>
              {!isCreate ? <p className="modal-subtitle">Raised on {issue?.createdDate || "-"}</p> : null}
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto">
          {isCreate ? (
            <div className="grid gap-4">
              <div>
                <label className="form-label" htmlFor="issue-subject">Subject</label>
                <input id="issue-subject" className="form-input" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Enter issue subject" required minLength={3} maxLength={140} />
              </div>
              <div>
                <label className="form-label" htmlFor="issue-description">Description</label>
                <textarea id="issue-description" className="form-input min-h-36 resize-y" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the issue" required minLength={10} maxLength={3000} />
              </div>
              <div>
                <label className="form-label" htmlFor="issue-priority">Priority</label>
                <select id="issue-priority" className="form-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                  {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={issue?.status} />
                <span className="modal-chip">{issue?.priority} Priority</span>
              </div>
              <div className="modal-section">
                <h3 className="modal-section-title">Description</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-portal-muted">{issue?.description || "-"}</p>
              </div>
              <div className="modal-section modal-detail-grid">
                <p><b>Raised By:</b> {issue?.raisedByName || "-"}</p>
                <p><b>Email:</b> {issue?.raisedByEmail || "-"}</p>
                <p><b>Created:</b> {issue?.createdDate || "-"}</p>
                <p><b>Updated:</b> {issue?.updatedDate || "-"}</p>
                {issue?.closedDate ? <p><b>Closed:</b> {issue.closedDate}</p> : null}
                {issue?.closedByName ? <p><b>Closed By:</b> {issue.closedByName}</p> : null}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-portal-border bg-slate-50 px-5 py-4">
          <CustomButton variant="secondary" type="button" onClick={onClose}>Cancel</CustomButton>
          {isCreate ? (
            <CustomButton type="submit" loading={loading}>Submit Issue</CustomButton>
          ) : canUpdateStatus ? (
            <CustomButton type="button" loading={loading} variant={nextStatus === "Closed" ? "danger" : "primary"} onClick={() => onStatusChange(issue, nextStatus)}>
              Mark as {nextStatus}
            </CustomButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
