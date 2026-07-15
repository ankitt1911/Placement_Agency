import { GetPublicCompaniesApi, GetPublicJobsApi } from "../apiMethod";
import { asList, mapCompany, mapJob } from "./apiAdapters";

const handleGetPublicCompanies = async (params = {}) => asList(await GetPublicCompaniesApi(params)).map(mapCompany);
const handleGetPublicJobs = async (params = {}) => asList(await GetPublicJobsApi(params)).map(mapJob);

export { handleGetPublicCompanies, handleGetPublicJobs };
