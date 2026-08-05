import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Pause, Pencil, Play, Plus, Radio, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { handleCreateBroadcast, handleDeleteBroadcast, handleGetBroadcasts, handleToggleBroadcast, handleUpdateBroadcast } from "../../Services/apiCalling/broadcastApis";
import { SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import CustomButton from "../custom/customButton";
import EmptyState from "../custom/emptyState";
import PageLoader from "../loader/PageLoader";
import ConfirmModal from "../modal/confirmModal";
import { broadcastCategories, broadcastPriorities, stateToneClass, themeFor } from "./broadcastConstants";

const emptyForm = { title: "", message: "", category: "Announcement", priority: "Normal", linkLabel: "", linkUrl: "", startsAt: "", endsAt: "" };

const toForm = (broadcast) => ({
  title: broadcast.title || "",
  message: broadcast.message || "",
  category: broadcast.category || "Announcement",
  priority: broadcast.priority || "Normal",
  linkLabel: broadcast.linkLabel || "",
  linkUrl: broadcast.linkUrl || "",
  startsAt: broadcast.startsAtDate || "",
  endsAt: broadcast.endsAtDate || ""
});

function BroadcastRow({ broadcast, onEdit, onToggle, onDelete, busy }) {
  const theme = themeFor(broadcast.category);
  const Icon = theme.icon;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-portal-border bg-white p-3 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-sm`}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-extrabold text-portal-ink">{broadcast.title}</h3>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${stateToneClass(broadcast.state)}`}>{broadcast.state}</span>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${theme.chip}`}>{broadcast.category}</span>
              {broadcast.priority === "High" ? <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">High</span> : null}
            </div>
            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs font-semibold leading-5 text-portal-muted">{broadcast.message}</p>
            <p className="mt-1 text-[11px] font-semibold text-portal-muted">
              {broadcast.startsAtDate || broadcast.createdDate || "-"}
              {broadcast.endsAtDate ? ` → ${broadcast.endsAtDate}` : " → no end date"}
              {broadcast.createdByName ? ` • by ${broadcast.createdByName}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button className="listing-action listing-action-blue" type="button" disabled={busy} onClick={() => onEdit(broadcast)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button className={`listing-action ${broadcast.isActive ? "listing-action-amber" : "listing-action-sky"}`} type="button" disabled={busy} onClick={() => onToggle(broadcast)}>
            {broadcast.isActive ? <><Pause className="h-3.5 w-3.5" /> Stop</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
          </button>
          <button className="listing-action listing-action-red" type="button" disabled={busy} onClick={() => onDelete(broadcast)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function BroadcastManagerModal({ open, onClose }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!open) return;
    setMode("list");
    setLoading(true);
    handleGetBroadcasts().then((data) => setBroadcasts(data || [])).finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setMode("form");
  };

  const startEdit = (broadcast) => {
    setEditing(broadcast);
    setForm(toForm(broadcast));
    setMode("form");
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      category: form.category,
      priority: form.priority,
      linkLabel: form.linkLabel.trim(),
      linkUrl: form.linkUrl.trim(),
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null
    };
    setSaving(true);
    try {
      if (editing) {
        const saved = await handleUpdateBroadcast(editing.id, payload);
        setBroadcasts((current) => current.map((item) => item.id === saved.id ? saved : item));
        SuccessMessage("Broadcast updated");
      } else {
        const saved = await handleCreateBroadcast(payload);
        setBroadcasts((current) => [saved, ...current]);
        SuccessMessage("Broadcast published");
      }
      setMode("list");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (broadcast) => {
    setBusy(true);
    try {
      const saved = await handleToggleBroadcast(broadcast.id);
      setBroadcasts((current) => current.map((item) => item.id === saved.id ? saved : item));
      SuccessMessage(saved.isActive ? "Broadcast resumed" : "Broadcast stopped");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await handleDeleteBroadcast(deleteTarget.id);
      setBroadcasts((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      SuccessMessage("Broadcast deleted");
    } finally {
      setBusy(false);
    }
  };

  const ongoing = broadcasts.filter((broadcast) => broadcast.ongoing);
  const rest = broadcasts.filter((broadcast) => !broadcast.ongoing);

  return (
    <>
      <div className="modal-backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="modal-shell flex max-h-[88vh] max-w-4xl flex-col"
        >
          <div className="modal-header">
            <div className="flex min-w-0 items-start gap-3">
              <span className="modal-header-icon">
                <Radio className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="modal-eyebrow">Broadcast</span>
                <h2 className="modal-title">{mode === "form" ? (editing ? "Edit broadcast" : "New broadcast") : "Student broadcasts"}</h2>
                <p className="modal-subtitle">
                  {mode === "form" ? "Ongoing broadcasts appear on every student dashboard." : `${ongoing.length} ongoing • ${broadcasts.length} total`}
                </p>
              </div>
            </div>
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "list" ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-body min-h-0 flex-1 overflow-y-auto">
                <div className="mb-4 flex justify-end">
                  <CustomButton type="button" onClick={startCreate}>
                    <Plus className="h-4 w-4" /> New broadcast
                  </CustomButton>
                </div>
                {loading ? <PageLoader /> : broadcasts.length ? (
                  <div className="grid gap-4">
                    {ongoing.length ? (
                      <div className="grid gap-2">
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Ongoing</p>
                        <AnimatePresence initial={false}>
                          {ongoing.map((broadcast) => <BroadcastRow key={broadcast.id} broadcast={broadcast} onEdit={startEdit} onToggle={toggle} onDelete={setDeleteTarget} busy={busy} />)}
                        </AnimatePresence>
                      </div>
                    ) : null}
                    {rest.length ? (
                      <div className="grid gap-2">
                        <p className="text-xs font-black uppercase tracking-wide text-portal-muted">Not showing</p>
                        <AnimatePresence initial={false}>
                          {rest.map((broadcast) => <BroadcastRow key={broadcast.id} broadcast={broadcast} onEdit={startEdit} onToggle={toggle} onDelete={setDeleteTarget} busy={busy} />)}
                        </AnimatePresence>
                      </div>
                    ) : null}
                  </div>
                ) : <EmptyState title="No broadcasts yet" message="Create one to show it on every student dashboard." />}
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.2 }} className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
                <div className="modal-body min-h-0 flex-1 overflow-y-auto">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="form-label" htmlFor="broadcast-title">Title</label>
                      <input id="broadcast-title" className="form-input" value={form.title} onChange={setField("title")} placeholder="Campus drive on 20th August" required minLength={3} maxLength={140} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-label" htmlFor="broadcast-message">Message</label>
                      <textarea id="broadcast-message" className="form-input min-h-32 resize-y" value={form.message} onChange={setField("message")} placeholder="What should every student know?" required minLength={3} maxLength={2000} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-category">Category</label>
                      <select id="broadcast-category" className="form-input" value={form.category} onChange={setField("category")}>
                        {broadcastCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-priority">Priority</label>
                      <select id="broadcast-priority" className="form-input" value={form.priority} onChange={setField("priority")}>
                        {broadcastPriorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-starts">Starts on</label>
                      <input id="broadcast-starts" className="form-input" type="date" value={form.startsAt} onChange={setField("startsAt")} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-ends">Ends on</label>
                      <input id="broadcast-ends" className="form-input" type="date" value={form.endsAt} onChange={setField("endsAt")} />
                      <p className="mt-1 text-[11px] font-semibold text-portal-muted">Leave empty to run until you stop it.</p>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-link-label">Button label</label>
                      <input id="broadcast-link-label" className="form-input" value={form.linkLabel} onChange={setField("linkLabel")} placeholder="Know more" maxLength={60} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="broadcast-link">Button link</label>
                      <input id="broadcast-link" className="form-input" value={form.linkUrl} onChange={setField("linkUrl")} placeholder="https://..." maxLength={500} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-portal-border bg-slate-50 px-5 py-4">
                  <CustomButton variant="secondary" type="button" onClick={() => setMode("list")}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </CustomButton>
                  <CustomButton type="submit" loading={saving}>{editing ? "Save changes" : "Publish broadcast"}</CustomButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete broadcast"
        message={`Delete "${deleteTarget?.title}"? Students will stop seeing it immediately.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        loading={busy}
      />
    </>
  );
}
