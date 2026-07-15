import { GetOperationsDashboardApi, GetStudentDashboardApi } from "../apiMethod";
import { mapApplication, mapJob, unwrapData } from "./apiAdapters";

const handleGetStudentDashboard = async () => {
  try {
    const data = unwrapData(await GetStudentDashboardApi(), {});
    const shortlistedCount = (data.applicationsByStatus || [])
      .filter((item) => ["Shortlisted", "Selected"].includes(item._id))
      .reduce((total, item) => total + item.count, 0);
    return {
      summary: {
        profileCompletion: data.profileCompletion || 0,
        totalOpenings: data.latestOpenJobs?.length || 0,
        totalAppliedJobs: data.totalApplications || 0,
        shortlistedCount
      },
      recentOpenings: (data.latestOpenJobs || []).map(mapJob),
      recentApplications: (data.recentApplications || []).map(mapApplication)
    };
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return null;
  }
};

const handleGetOperationsDashboard = async () => {
  try {
    const data = unwrapData(await GetOperationsDashboardApi(), {});
    return {
      summary: {
        totalStudents: data.students || 0,
        activeStudents: data.activeStudents || 0,
        totalCompanies: data.companies || 0,
        activeCompanies: data.activeCompanies || 0,
        openJobs: data.openJobs || 0,
        closedJobs: data.closedJobs || 0,
        totalApplications: data.applications || 0,
        openLinkStudents: data.openLinkStudents || 0,
        openLinkApplications: data.openLinkApplications || 0,
        shortlistedSelected: data.shortlistedSelected || 0
      },
      recentApplications: (data.recentApplications || []).map(mapApplication),
      recentOpenings: (data.latestOpenJobs || []).map(mapJob)
    };
  } catch (error) {
    console.error("Error fetching operations dashboard:", error);
    return null;
  }
};

export { handleGetStudentDashboard, handleGetOperationsDashboard };
