import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, ClipboardList, LockKeyhole, Sparkles, UsersRound } from "lucide-react";
import { handleGetOperationsDashboard } from "../../Services/apiCalling/dashboardApis";
import EmptyState from "../custom/emptyState";
import PageLoader from "../loader/PageLoader";
import ApplicationSummaryCard from "./applicationSummaryCard";
import DashboardStatCard from "./dashboardStatCard";
import RecentOpeningsSlider from "./recentOpeningsSlider";

export default function OperationsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedInName = useSelector((state) => state.auth.user?.name);

  useEffect(() => {
    handleGetOperationsDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  const summary = data?.summary || {};
  const overviewTitle = `${loggedInName || "Operations"}'s Overview`;
  const cards = [
    ["Total students", summary.totalStudents, UsersRound],
    ["Active students", summary.activeStudents, CheckCircle2],
    ["Open link students", summary.openLinkStudents, UsersRound],
    ["Open link applications", summary.openLinkApplications, ClipboardList],
    ["Total companies", summary.totalCompanies, Building2],
    ["Active companies", summary.activeCompanies, CheckCircle2],
    ["Open jobs", summary.openJobs, BriefcaseBusiness],
    ["Closed jobs", summary.closedJobs, LockKeyhole],
    ["Applications", summary.totalApplications, ClipboardList],
    ["Shortlisted/Selected", summary.shortlistedSelected, CheckCircle2]
  ];

  return (
    <div className="page-shell">
      <section className="dashboard-hero animate-dashboard-enter">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
              <Sparkles className="h-4 w-4" />
              Operations command center
            </span>
            <h1 className="mt-3 text-3xl font-black leading-tight text-portal-ink sm:text-4xl">{overviewTitle}</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-portal-muted">Monitor students, companies, openings, and applications with a lively operations snapshot.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="secondary-btn" to="/operations/companies">Add company</Link>
            <Link className="secondary-btn" to="/operations/job-openings">Create opening</Link>
            <Link className="primary-btn" to="/operations/applied-students">View applicants<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, icon], index) => (
          <div className="animate-dashboard-enter" style={{ animationDelay: `${80 + index * 45}ms` }} key={label}>
            <DashboardStatCard label={label} value={value || 0} icon={icon} tone={index} />
          </div>
        ))}
      </div>
      <section className="dashboard-section animate-dashboard-enter" style={{ animationDelay: "560ms" }}>
        <div className="dashboard-section-header">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Pipeline</p>
            <h2 className="section-title">Recent openings</h2>
          </div>
        </div>
        {data?.recentOpenings?.length ? <RecentOpeningsSlider openings={data.recentOpenings} to="/operations/job-openings" /> : <EmptyState />}
      </section>
      <section className="dashboard-section animate-dashboard-enter" style={{ animationDelay: "620ms" }}>
        <div className="dashboard-section-header">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Activity</p>
            <h2 className="section-title">Recent applications</h2>
          </div>
        </div>
        {data?.recentApplications?.length ? <div className="grid gap-3">{data.recentApplications.map((item) => <ApplicationSummaryCard key={item.id} application={item} />)}</div> : <EmptyState />}
      </section>
    </div>
  );
}
