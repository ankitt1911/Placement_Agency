import { X } from "lucide-react";
import AppSidenav from "./AppSidenav";

export default function AppSidedrawer({ open, onClose, role }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button className="absolute inset-0 bg-slate-950/40" onClick={onClose} aria-label="Close navigation" />
      <div className="relative h-full w-72 bg-white shadow-xl">
        <button className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <AppSidenav role={role} mobile />
      </div>
    </div>
  );
}
