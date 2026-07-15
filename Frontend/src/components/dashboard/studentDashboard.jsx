import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, UserRoundCheck } from "lucide-react";
import { handleGetStudentDashboard } from "../../Services/apiCalling/dashboardApis";
import EmptyState from "../custom/emptyState";
import PageLoader from "../loader/PageLoader";
import ApplicationSummaryCard from "./applicationSummaryCard";
import DashboardStatCard from "./dashboardStatCard";
import RecentOpeningCard from "./recentOpeningCard";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const candidateName = useSelector((state) => state.auth.user?.name);

  useEffect(() => {
    handleGetStudentDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  const summary = data?.summary || {};
  const dashboardTitle = `${candidateName || "Candidate"}'s Dashboard`;

  return (
    <div className="page-shell">
      <section className="dashboard-hero animate-dashboard-enter">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black leading-tight text-portal-ink sm:text-4xl">{dashboardTitle}</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-portal-muted">Track your profile, applications, and latest openings from one polished view.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="secondary-btn" to="/student/profile">Complete profile</Link>
            <Link className="primary-btn" to="/student/openings">View openings<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-dashboard-enter" style={{ animationDelay: "80ms" }}><DashboardStatCard label="Profile completion" value={`${summary.profileCompletion || 0}%`} icon={UserRoundCheck} /></div>
        <div className="animate-dashboard-enter" style={{ animationDelay: "140ms" }}><DashboardStatCard label="Total openings" value={summary.totalOpenings || 0} icon={BriefcaseBusiness} /></div>
        <div className="animate-dashboard-enter" style={{ animationDelay: "200ms" }}><DashboardStatCard label="Applied jobs" value={summary.totalAppliedJobs || 0} icon={ClipboardList} /></div>
        <div className="animate-dashboard-enter" style={{ animationDelay: "260ms" }}><DashboardStatCard label="Shortlisted" value={summary.shortlistedCount || 0} icon={CheckCircle2} /></div>
      </div>
      <section className="dashboard-section animate-dashboard-enter" style={{ animationDelay: "320ms" }}>
        <div className="dashboard-section-header">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Explore</p>
            <h2 className="section-title">Recent openings</h2>
          </div>
        </div>
        {data?.recentOpenings?.length ? <div className="grid gap-4 lg:grid-cols-3">{data.recentOpenings.map((item) => <RecentOpeningCard key={item.id} opening={item} state={{ openingId: item.id }} />)}</div> : <EmptyState />}
      </section>
      <section className="dashboard-section animate-dashboard-enter" style={{ animationDelay: "380ms" }}>
        <div className="dashboard-section-header">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Progress</p>
            <h2 className="section-title">Application status</h2>
          </div>
        </div>
        <div className="grid gap-3">{data?.recentApplications?.map((item) => <ApplicationSummaryCard key={item.id} application={item} />)}</div>
      </section>
    </div>
  );
}
