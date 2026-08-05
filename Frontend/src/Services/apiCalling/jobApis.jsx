import {
  ApplyToOpeningApi,
  GetApplicationDetailsApi,
  GetOpeningFilterOptionsApi,
  GetOpeningDetailsApi,
  GetOpeningsApi,
  GetStudentApplicationFilterOptionsApi,
  GetStudentApplicationsApi,
  WithdrawApplicationApi
} from "../apiMethod";
import { asList, mapApplication, mapJob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetOpenings = async (params = {}) => {
  try {
    return asList(await GetOpeningsApi(params)).map(mapJob);
  } catch (error) {
    console.error("Error fetching openings:", error);
    return [];
  }
};

const handleGetOpeningDetails = async (id) => mapJob(unwrapData(await GetOpeningDetailsApi(id), {}));
const handleGetOpeningFilterOptions = async () => unwrapFilterOptions(await GetOpeningFilterOptionsApi());

const handleApplyToOpening = async ({ openingId }) => {
  try {
    return unwrapData(await ApplyToOpeningApi(openingId), {});
  } catch (error) {
    console.error("Error applying to opening:", error);
    return null;
  }
};

const handleGetStudentApplications = async (params = {}) => asList(await GetStudentApplicationsApi(params)).map(mapApplication);
const handleGetStudentApplicationFilterOptions = async (params = {}) => unwrapFilterOptions(await GetStudentApplicationFilterOptionsApi(params));
const handleGetApplicationDetails = async (id) => mapApplication(unwrapData(await GetApplicationDetailsApi(id), {}));
const handleWithdrawApplication = async ({ applicationId }) => unwrapData(await WithdrawApplicationApi(applicationId), {});

export {
  handleGetOpenings,
  handleGetOpeningDetails,
  handleGetOpeningFilterOptions,
  handleApplyToOpening,
  handleGetStudentApplications,
  handleGetStudentApplicationFilterOptions,
  handleGetApplicationDetails,
  handleWithdrawApplication
};
