import { AddCompanyApi, DeleteCompanyApi, EditCompanyApi, ExportCompaniesExcelApi, GetCompaniesApi, GetCompanyFilterOptionsApi, ToggleCompanyApi } from "../apiMethod";
import { asList, mapCompany, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetCompanies = async (params = {}) => asList(await GetCompaniesApi(params)).map(mapCompany);
const handleGetCompanyFilterOptions = async () => unwrapFilterOptions(await GetCompanyFilterOptionsApi());
const handleAddCompany = async (company) => mapCompany(unwrapData(await AddCompanyApi(company), company));
const handleEditCompany = async (company) => {
  const { id, ...payload } = company;
  return mapCompany(unwrapData(await EditCompanyApi(id, payload), company));
};
const handleDeleteCompany = async (id) => DeleteCompanyApi(id);
const handleSetCompanyStatus = async (id) => ToggleCompanyApi(id);
const handleExportCompaniesExcel = async (params = {}) => unwrapBlob(await ExportCompaniesExcelApi(params));

export { handleGetCompanies, handleGetCompanyFilterOptions, handleAddCompany, handleEditCompany, handleDeleteCompany, handleSetCompanyStatus, handleExportCompaniesExcel };
