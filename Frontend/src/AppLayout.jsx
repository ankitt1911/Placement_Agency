import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./ReduxFeature/Authenthicate/LoginSlice";
import AppFooter from "./components/layouts/AppFooter";
import AppHeader from "./components/layouts/AppHeader";
import AppSidedrawer from "./components/layouts/AppSidedrawer";
import AppSidenav from "./components/layouts/AppSidenav";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen overflow-hidden bg-portal-canvas">
      <div className="flex h-screen overflow-hidden">
        <AppSidenav role={role} />
        <AppSidedrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} role={role} />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <AppHeader user={user} onMenu={() => setDrawerOpen(true)} onLogout={handleLogout} />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
