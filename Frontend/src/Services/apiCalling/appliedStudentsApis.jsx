import { BulkChangeApplicantStatusApi, ChangeApplicantStatusApi, DownloadApplicantResumeApi, ExportApplicantsExcelApi, GetApplicantFilterOptionsApi, GetApplicantsApi } from "../apiMethod";
import { asList, mapApplication, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetApplicants = async (params = {}) => asList(await GetApplicantsApi(params)).map(mapApplication);
const handleGetApplicantFilterOptions = async (params = {}) => unwrapFilterOptions(await GetApplicantFilterOptionsApi(params));
const handleChangeApplicantStatus = async (id, status, note = "") => mapApplication(unwrapData(await ChangeApplicantStatusApi(id, { status, note }), {}));
// Partial-success, like bulk scheduling: some applications can be skipped while
// the rest move on, so the counters travel back with the updated records.
const handleBulkChangeApplicantStatus = async (applications, status, note = "") => {
  const response = await BulkChangeApplicantStatusApi({ applications, status, note });
  const data = asList(response).map(mapApplication);
  return { updated: response?.raw?.updated ?? data.length, skipped: response?.raw?.skipped || [], data };
};
const handleDownloadApplicantResume = async (applicant) => unwrapBlob(await DownloadApplicantResumeApi(applicant.id));
const handleExportApplicantsExcel = async (params = {}) => unwrapBlob(await ExportApplicantsExcelApi(params));

export { handleGetApplicants, handleGetApplicantFilterOptions, handleChangeApplicantStatus, handleBulkChangeApplicantStatus, handleDownloadApplicantResume, handleExportApplicantsExcel };
