import { apiConstant } from "./apiConstant";
import apiRequest from "./apiService";

export const HealthApi = () => apiRequest(apiConstant.health, "Get");
export const RegisterApi = (params) => apiRequest(apiConstant.register, "Post", params, true);
export const LoginApi = (params) => apiRequest(apiConstant.logIn, "Post", params, true);
export const ChangePasswordApi = (params) => apiRequest(apiConstant.changePassword, "Patch", params, true);
export const RefreshTokenApi = () => apiRequest(apiConstant.refreshToken, "Post", {}, true);
export const LogoutApi = () => apiRequest(apiConstant.signOut, "Post", {}, true);

export const GetProfileApi = () => apiRequest(apiConstant.getProfile, "Get");
export const UpdateProfileApi = (params) => apiRequest(apiConstant.updateProfile, "Put", params, true);
export const UploadProfilePhotoApi = (params) => apiRequest(apiConstant.uploadProfilePhoto, "Patch", params, true);
export const UploadResumeApi = (params) => apiRequest(apiConstant.uploadResume, "Patch", params, true);

export const GetPublicCompaniesApi = (params) => apiRequest(apiConstant.getPublicCompanies, "Get", params);
export const GetPublicJobsApi = (params) => apiRequest(apiConstant.getPublicJobs, "Get", params);
export const GetOpeningsApi = (params) => apiRequest(apiConstant.getOpenings, "Get", params);
export const GetOpeningFilterOptionsApi = () => apiRequest(apiConstant.getOpeningFilterOptions, "Get");
export const GetOpeningDetailsApi = (id) => apiRequest(apiConstant.getOpeningDetails(id), "Get");
export const ApplyToOpeningApi = (jobId) => apiRequest(apiConstant.applyToOpening(jobId), "Post", {}, true);
export const GetOpenLinkOpeningApi = (id) => apiRequest(apiConstant.getOpenLinkOpening(id), "Get");
export const ApplyViaOpenLinkApi = (id, params) => apiRequest(apiConstant.applyViaOpenLink(id), "Post", params, true);
export const GetStudentApplicationsApi = (params) => apiRequest(apiConstant.getStudentApplications, "Get", params);
export const GetStudentApplicationFilterOptionsApi = (params) => apiRequest(apiConstant.getStudentApplicationFilterOptions, "Get", params);
export const GetApplicationDetailsApi = (id) => apiRequest(apiConstant.getApplicationDetails(id), "Get");
export const WithdrawApplicationApi = (id) => apiRequest(apiConstant.withdrawApplication(id), "Post", {}, true);

export const GetStudentDashboardApi = () => apiRequest(apiConstant.studentDashboard, "Get");
export const GetOperationsDashboardApi = () => apiRequest(apiConstant.operationsDashboard, "Get");

export const GetCompaniesApi = (params) => apiRequest(apiConstant.getCompanies, "Get", params);
export const GetCompanyFilterOptionsApi = () => apiRequest(apiConstant.getCompanyFilterOptions, "Get");
export const AddCompanyApi = (params) => apiRequest(apiConstant.addCompany, "Post", params, true);
export const GetCompanyDetailsApi = (id) => apiRequest(apiConstant.getCompanyDetails(id), "Get");
export const EditCompanyApi = (id, params) => apiRequest(apiConstant.editCompany(id), "Put", params, true);
export const DeleteCompanyApi = (id) => apiRequest(apiConstant.deleteCompany(id), "Delete", {}, true);
export const ToggleCompanyApi = (id) => apiRequest(apiConstant.toggleCompany(id), "Patch", {}, true);
export const ExportCompaniesExcelApi = (params) => apiRequest(apiConstant.exportCompaniesExcel, "Get", params, false, {}, "blob");

export const GetStudentsApi = (params) => apiRequest(apiConstant.getStudents, "Get", params);
export const GetStudentFilterOptionsApi = () => apiRequest(apiConstant.getStudentFilterOptions, "Get");
export const GetStudentDetailsApi = (id) => apiRequest(apiConstant.getStudentDetails(id), "Get");
export const EditStudentApi = (id, params) => apiRequest(apiConstant.editStudent(id), "Put", params, true);
export const DisableStudentApi = (id) => apiRequest(apiConstant.disableStudent(id), "Patch", {}, true);
export const DeleteStudentApi = (id) => apiRequest(apiConstant.deleteStudent(id), "Delete", {}, true);
export const DownloadResumeApi = (id) => apiRequest(apiConstant.downloadResume(id), "Get", {}, false, {}, "blob");
export const ExportStudentsExcelApi = (params) => apiRequest(apiConstant.exportStudentsExcel, "Get", params, false, {}, "blob");

export const GetOperationsOpeningsApi = (params) => apiRequest(apiConstant.getOperationsOpenings, "Get", params);
export const GetOperationsOpeningFilterOptionsApi = () => apiRequest(apiConstant.getOperationsOpeningFilterOptions, "Get");
export const CreateOpeningApi = (params) => apiRequest(apiConstant.createOpening, "Post", params, true);
export const GetOpeningAdminDetailsApi = (id) => apiRequest(apiConstant.updateOpening(id), "Get");
export const UpdateOpeningApi = (id, params) => apiRequest(apiConstant.updateOpening(id), "Put", params, true);
export const DeleteOpeningApi = (id) => apiRequest(apiConstant.deleteOpening(id), "Delete", {}, true);
export const CloseOpeningApi = (id) => apiRequest(apiConstant.closeOpening(id), "Patch", {}, true);
export const ReopenOpeningApi = (id) => apiRequest(apiConstant.reopenOpening(id), "Patch", {}, true);
export const UpdateOpeningOpenLinkApi = (id, params) => apiRequest(apiConstant.updateOpeningOpenLink(id), "Patch", params, true);
export const CloseOpeningOpenLinkApi = (id) => apiRequest(apiConstant.closeOpeningOpenLink(id), "Patch", {}, true);
export const DuplicateOpeningApi = (id) => apiRequest(apiConstant.duplicateOpening(id), "Post", {}, true);
export const ExportJobsExcelApi = (params) => apiRequest(apiConstant.exportJobsExcel, "Get", params, false, {}, "blob");
export const GetJobApplicantsApi = (id) => apiRequest(apiConstant.getJobApplicants(id), "Get");

export const GetApplicantsApi = (params) => apiRequest(apiConstant.getApplicants, "Get", params);
export const GetApplicantFilterOptionsApi = (params) => apiRequest(apiConstant.getApplicantFilterOptions, "Get", params);
export const GetApplicantDetailsApi = (id) => apiRequest(apiConstant.getApplicantDetails(id), "Get");
export const ChangeApplicantStatusApi = (id, params) => apiRequest(apiConstant.changeApplicantStatus(id), "Patch", params, true);
export const DownloadApplicantResumeApi = (id) => apiRequest(apiConstant.downloadApplicantResume(id), "Get", {}, false, {}, "blob");
export const ExportApplicantsExcelApi = (params) => apiRequest(apiConstant.exportApplicantsExcel, "Get", params, false, {}, "blob");

export const GetMyInterviewsApi = (params) => apiRequest(apiConstant.getMyInterviews, "Get", params);
export const GetInterviewsApi = (params) => apiRequest(apiConstant.getInterviews, "Get", params);
export const GetInterviewFilterOptionsApi = (params) => apiRequest(apiConstant.getInterviewFilterOptions, "Get", params);
export const ExportInterviewsExcelApi = (params) => apiRequest(apiConstant.exportInterviewsExcel, "Get", params, false, {}, "blob");
export const ScheduleInterviewApi = (params) => apiRequest(apiConstant.scheduleInterview, "Post", params, true);
export const GetInterviewDetailsApi = (id) => apiRequest(apiConstant.getInterviewDetails(id), "Get");
export const UpdateInterviewApi = (id, params) => apiRequest(apiConstant.updateInterview(id), "Put", params, true);
export const UpdateInterviewStatusApi = (id, params) => apiRequest(apiConstant.updateInterviewStatus(id), "Patch", params, true);
export const DeleteInterviewApi = (id) => apiRequest(apiConstant.deleteInterview(id), "Delete", {}, true);

export const GetMyIssuesApi = (params) => apiRequest(apiConstant.getMyIssues, "Get", params);
export const GetRaisedIssuesApi = (params) => apiRequest(apiConstant.getRaisedIssues, "Get", params);
export const CreateIssueApi = (params) => apiRequest(apiConstant.createIssue, "Post", params, true);
export const UpdateIssueStatusApi = (id, params) => apiRequest(apiConstant.updateIssueStatus(id), "Patch", params, true);

export const GetActiveBroadcastsApi = () => apiRequest(apiConstant.getActiveBroadcasts, "Get");
export const GetBroadcastsApi = (params) => apiRequest(apiConstant.getBroadcasts, "Get", params);
export const CreateBroadcastApi = (params) => apiRequest(apiConstant.createBroadcast, "Post", params, true);
export const UpdateBroadcastApi = (id, params) => apiRequest(apiConstant.updateBroadcast(id), "Put", params, true);
export const ToggleBroadcastApi = (id) => apiRequest(apiConstant.toggleBroadcast(id), "Patch", {}, true);
export const DeleteBroadcastApi = (id) => apiRequest(apiConstant.deleteBroadcast(id), "Delete", {}, true);
