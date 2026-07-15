import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No data found", message = "Try changing search or filters." }) {
  return (
    <div className="empty-state bg-gradient-to-br from-white to-brand-50/50">
      <span className="app-icon mx-auto mb-3">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
