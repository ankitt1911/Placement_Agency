const { createCompanySchema, updateCompanySchema } = require("../validators/companyValidators");
const companyService = require("../services/companyService");

const getCompanies = async (req, res) => companyService.fetchGetCompanies(req, res);
const getCompanyFilterOptions = async (req, res) => companyService.fetchGetCompanyFilterOptions(req, res);
const getCompanyDetail = async (req, res) => companyService.fetchGetCompanyDetail(req, res);
const deleteCompany = async (req, res) => companyService.fetchDeleteCompany(req, res);
const toggleCompany = async (req, res) => companyService.fetchToggleCompany(req, res);
const exportCompanies = async (req, res) => companyService.fetchExportCompanies(req, res);
const publicCompanies = async (req, res) => companyService.fetchPublicCompanies(req, res);

const createCompany = async (req, res) => {
  const { error } = createCompanySchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return companyService.fetchCreateCompany(req, res);
};

const updateCompany = async (req, res) => {
  const { error } = updateCompanySchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return companyService.fetchUpdateCompany(req, res);
};

module.exports = { getCompanies, getCompanyFilterOptions, createCompany, getCompanyDetail, updateCompany, deleteCompany, toggleCompany, exportCompanies, publicCompanies };
