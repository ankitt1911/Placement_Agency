import { BulkScheduleInterviewsApi, DeleteInterviewApi, ExportInterviewsExcelApi, GetInterviewDetailsApi, GetInterviewFilterOptionsApi, GetInterviewsApi, GetMyInterviewsApi, ScheduleInterviewApi, UpdateInterviewApi, UpdateInterviewStatusApi } from "../apiMethod";
import { asList, mapInterview, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetInterviews = async (params = {}) => asList(await GetInterviewsApi(params)).map(mapInterview);
const handleGetMyInterviews = async (params = {}) => asList(await GetMyInterviewsApi(params)).map(mapInterview);
const handleGetInterviewFilterOptions = async (params = {}) => unwrapFilterOptions(await GetInterviewFilterOptionsApi(params));
const handleExportInterviewsExcel = async (params = {}) => unwrapBlob(await ExportInterviewsExcelApi(params));
const handleGetInterviewDetails = async (id) => mapInterview(unwrapData(await GetInterviewDetailsApi(id), {}));
const handleScheduleInterview = async (payload) => mapInterview(unwrapData(await ScheduleInterviewApi(payload), {}));
// Bulk scheduling is partial-success: some applications can be skipped while the
// rest are created, so the raw counters travel back alongside the interviews.
const handleBulkScheduleInterviews = async (payload) => {
  const response = await BulkScheduleInterviewsApi(payload);
  const data = asList(response).map(mapInterview);
  return { created: response?.raw?.created ?? data.length, skipped: response?.raw?.skipped || [], data };
};
const handleUpdateInterview = async (id, payload) => mapInterview(unwrapData(await UpdateInterviewApi(id, payload), {}));
const handleUpdateInterviewStatus = async (id, status, feedback = "", note = "") => mapInterview(unwrapData(await UpdateInterviewStatusApi(id, { status, feedback, note }), {}));
const handleDeleteInterview = async (id) => DeleteInterviewApi(id);

export { handleGetInterviews, handleGetMyInterviews, handleGetInterviewFilterOptions, handleExportInterviewsExcel, handleGetInterviewDetails, handleScheduleInterview, handleBulkScheduleInterviews, handleUpdateInterview, handleUpdateInterviewStatus, handleDeleteInterview };
