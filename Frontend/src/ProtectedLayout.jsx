import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "./components/loader/PageLoader";
import { roleHome } from "./components/layouts/navigationConfig";

export default function ProtectedLayout({ allowedRole }) {
  const { isAuthenticated, role, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRole && role !== allowedRole) return <Navigate to={roleHome[role] || "/login"} replace />;
  return <Outlet />;
}
