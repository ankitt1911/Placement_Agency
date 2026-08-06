import { KeyRound, LogOut, Menu } from "lucide-react";
import CustomButton from "../custom/customButton";

export default function AppHeader({ user, onMenu, onLogout, onChangePassword }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-portal-border bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-portal-border bg-slate-50 p-2.5 text-portal-ink transition hover:bg-brand-50 hover:text-brand-700 lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-portal-ink">{user?.name || "User"}</p>
          <p className="text-xs text-portal-muted">{user?.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CustomButton variant="secondary" onClick={onChangePassword} title="Update Password">
          <KeyRound className="h-4 w-4" />
          <span className="hidden sm:inline">Update Password</span>
        </CustomButton>
        <CustomButton variant="secondary" className="border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100 hover:text-red-700" onClick={onLogout} title="Logout">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </CustomButton>
      </div>
    </header>
  );
}
