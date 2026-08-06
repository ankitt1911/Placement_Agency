import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./ReduxFeature/Authenthicate/LoginSlice";
import AppFooter from "./components/layouts/AppFooter";
import AppHeader from "./components/layouts/AppHeader";
import AppSidedrawer from "./components/layouts/AppSidedrawer";
import AppSidenav from "./components/layouts/AppSidenav";
import ConfirmModal from "./components/modal/confirmModal";
import ChangePasswordModal from "./components/modal/auth/changePasswordModal";
import { handleGetProfile } from "./Services/apiCalling/profileApis";
import { isStudentProfileComplete } from "./Utlis/Common/profileCompletion";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const checkProfile = useCallback(async () => {
    if (role !== "student") return;
    setCheckingProfile(true);
    const profile = await handleGetProfile();
    setProfileComplete(isStudentProfileComplete(profile));
    setCheckingProfile(false);
  }, [role]);

  useEffect(() => {
    checkProfile();
    const refresh = () => checkProfile();
    globalThis.addEventListener("student-profile-updated", refresh);
    return () => globalThis.removeEventListener("student-profile-updated", refresh);
  }, [checkProfile]);

  useEffect(() => {
    if (role === "student" && !checkingProfile && profileComplete === false && location.pathname !== "/student/profile") {
      setCompletionModalOpen(true);
      navigate("/student/profile", { replace: true });
    }
  }, [checkingProfile, location.pathname, navigate, profileComplete, role]);

  useEffect(() => {
    if (profileComplete === true) setCompletionModalOpen(false);
  }, [profileComplete]);

  const showCompletionModal = () => {
    setDrawerOpen(false);
    setCompletionModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen overflow-hidden bg-portal-canvas">
      <div className="flex h-screen overflow-hidden">
        <AppSidenav role={role} profileComplete={profileComplete} onBlockedNavigation={showCompletionModal} />
        <AppSidedrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} role={role} profileComplete={profileComplete} onBlockedNavigation={showCompletionModal} />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <AppHeader user={user} onMenu={() => setDrawerOpen(true)} onLogout={handleLogout} onChangePassword={() => setPasswordModalOpen(true)} />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      <ConfirmModal
        open={completionModalOpen}
        title="Complete your profile"
        message="Please fill in all mandatory fields in the Profile tab before accessing other student tabs."
        confirmLabel="Continue to profile"
        onClose={() => setCompletionModalOpen(false)}
        onConfirm={() => {
          setCompletionModalOpen(false);
          navigate("/student/profile");
        }}
      />
    </div>
  );
}
