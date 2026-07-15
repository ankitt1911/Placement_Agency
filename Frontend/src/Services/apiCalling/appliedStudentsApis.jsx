import { ChangeApplicantStatusApi, DownloadApplicantResumeApi, ExportApplicantsExcelApi, GetApplicantFilterOptionsApi, GetApplicantsApi } from "../apiMethod";
import { asList, mapApplication, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetApplicants = async (params = {}) => asList(await GetApplicantsApi(params)).map(mapApplication);
const handleGetApplicantFilterOptions = async (params = {}) => unwrapFilterOptions(await GetApplicantFilterOptionsApi(params));
const handleChangeApplicantStatus = async (id, status, note = "") => mapApplication(unwrapData(await ChangeApplicantStatusApi(id, { status, note }), {}));
const handleDownloadApplicantResume = async (applicant) => unwrapBlob(await DownloadApplicantResumeApi(applicant.id));
const handleExportApplicantsExcel = async (params = {}) => unwrapBlob(await ExportApplicantsExcelApi(params));

export { handleGetApplicants, handleGetApplicantFilterOptions, handleChangeApplicantStatus, handleDownloadApplicantResume, handleExportApplicantsExcel };
