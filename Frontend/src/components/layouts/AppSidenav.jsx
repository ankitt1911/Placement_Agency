import { NavLink } from "react-router-dom";
import { navItems } from "./navigationConfig";

export default function AppSidenav({ role, mobile = false, profileComplete = true, onBlockedNavigation }) {
  return (
    <aside className={`${mobile ? "block" : "fixed inset-y-0 left-0 z-20 hidden lg:block"} w-72 shrink-0 overflow-y-auto border-r border-portal-border bg-white animate-dashboard-enter`}>
      <div className="flex h-20 items-center border-b border-portal-border bg-white px-5">
        <div>
          <p className="font-serif text-xl font-bold italic leading-none text-red-500">MAGNUS</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">COPO</p>
        </div>
      </div>
      <div className="px-5 pt-5">
        <p className="text-xs font-semibold text-portal-ink">Main <span className="text-brand-600">•</span></p>
      </div>
      <nav className="space-y-1 p-3">
        {(navItems[role] || []).map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              onClick={(event) => {
                if (role === "student" && !profileComplete && item.path !== "/student/profile") {
                  event.preventDefault();
                  onBlockedNavigation?.();
                }
              }}
              style={{ animationDelay: `${80 + index * 45}ms` }}
              className={({ isActive }) =>
                `sidenav-item flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-500 ease-out ${isActive ? "scale-[1.02] bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]" : "text-portal-ink hover:-translate-y-0.5 hover:bg-slate-100 hover:text-blue-700"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 transition-all duration-500 ease-out ${isActive ? "text-black" : "text-current"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="transition-all duration-500 ease-out">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
