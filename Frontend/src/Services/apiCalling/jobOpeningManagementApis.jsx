import {
  CloseOpeningApi,
  CreateOpeningApi,
  DeleteOpeningApi,
  DuplicateOpeningApi,
  ExportJobsExcelApi,
  GetJobApplicantsApi,
  GetOperationsOpeningFilterOptionsApi,
  GetOperationsOpeningsApi,
  ReopenOpeningApi,
  CloseOpeningOpenLinkApi,
  UpdateOpeningOpenLinkApi,
  UpdateOpeningApi
} from "../apiMethod";
import { asList, mapApplication, mapJob, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetOperationsOpenings = async (params = {}) => asList(await GetOperationsOpeningsApi(params)).map(mapJob);
const handleGetOperationsOpeningFilterOptions = async () => unwrapFilterOptions(await GetOperationsOpeningFilterOptionsApi());
const handleCreateOpening = async (opening) => mapJob(unwrapData(await CreateOpeningApi(opening), opening));
const handleUpdateOpening = async (opening) => {
  const { id, ...payload } = opening;
  return mapJob(unwrapData(await UpdateOpeningApi(id, payload), opening));
};
const handleDeleteOpening = async (id) => DeleteOpeningApi(id);
const handleSetOpeningStatus = async (id, status) => status === "Closed" ? CloseOpeningApi(id) : ReopenOpeningApi(id);
const handleUpdateOpeningOpenLink = async (id, payload) => mapJob(unwrapData(await UpdateOpeningOpenLinkApi(id, payload), payload));
const handleCloseOpeningOpenLink = async (id) => mapJob(unwrapData(await CloseOpeningOpenLinkApi(id), {}));
const handleDuplicateOpening = async (opening) => mapJob(unwrapData(await DuplicateOpeningApi(opening.id), opening));
const handleExportApplicants = async (params = {}) => unwrapBlob(await ExportJobsExcelApi(params));
const handleGetJobApplicants = async (id) => asList(await GetJobApplicantsApi(id)).map(mapApplication);

export {
  handleGetOperationsOpenings,
  handleGetOperationsOpeningFilterOptions,
  handleCreateOpening,
  handleUpdateOpening,
  handleDeleteOpening,
  handleSetOpeningStatus,
  handleUpdateOpeningOpenLink,
  handleCloseOpeningOpenLink,
  handleDuplicateOpening,
  handleExportApplicants,
  handleGetJobApplicants
};
