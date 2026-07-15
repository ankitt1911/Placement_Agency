import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedLayout from "./ProtectedLayout";
import { checkAuth } from "./ReduxFeature/Authenthicate/LoginSlice";
import { roleHome } from "./components/layouts/navigationConfig";
import LandingPage from "./landingPage/LandingPage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import StudentDashboardPage from "./pages/dashboard/studentDashboardPage";
import AppliedStudentsPage from "./pages/operations/appliedStudentsPage";
import CompanyManagementPage from "./pages/operations/companyManagementPage";
import JobOpeningManagementPage from "./pages/operations/jobOpeningManagementPage";
import OperationsDashboardPage from "./pages/operations/operationsDashboardPage";
import StudentManagementPage from "./pages/operations/studentManagementPage";
import OpenLinkApplicationPage from "./pages/openLinkApplicationPage";
import ProfilePage from "./pages/profile/profilePage";
import StudentAppliedJobsPage from "./pages/studentAppliedJobs/studentAppliedJobsPage";
import StudentOpeningsPage from "./pages/studentOpenings/studentOpeningsPage";

function RootRedirect() {
  const { isAuthenticated, role, isAuthChecked } = useSelector((state) => state.auth);
  if (!isAuthChecked) return null;
  if (isAuthenticated && roleHome[role]) return <Navigate to={roleHome[role]} replace />;
  return <LandingPage />;
}

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/login"
          element={isAuthChecked && isAuthenticated && roleHome[role] ? <Navigate to={roleHome[role]} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthChecked && isAuthenticated && roleHome[role] ? <Navigate to={roleHome[role]} replace /> : <RegisterPage />}
        />
        <Route path="/open-link/:id" element={<OpenLinkApplicationPage />} />
        <Route element={<ProtectedLayout allowedRole="student" />}>
          <Route element={<AppLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/openings" element={<StudentOpeningsPage />} />
            <Route path="/student/applied-jobs" element={<StudentAppliedJobsPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedLayout allowedRole="operations" />}>
          <Route element={<AppLayout />}>
            <Route path="/operations/dashboard" element={<OperationsDashboardPage />} />
            <Route path="/operations/students" element={<StudentManagementPage />} />
            <Route path="/operations/companies" element={<CompanyManagementPage />} />
            <Route path="/operations/job-openings" element={<JobOpeningManagementPage />} />
            <Route path="/operations/applied-students" element={<AppliedStudentsPage />} />
            <Route path="/operations/open-link-applications" element={<AppliedStudentsPage openLinkOnly />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated && roleHome[role] ? roleHome[role] : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
