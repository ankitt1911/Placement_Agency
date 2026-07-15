const Company = require("../models/companyModel");
const JobOpening = require("../models/jobOpeningModel");
const { exportExcel } = require("../utils/exportExcel");

const requireOps = (req, res) => {
  if (req.user.role !== "operations") {
    res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    return false;
  }
  return true;
};

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const companyQuery = (query, publicOnly = false) => {
  const filter = publicOnly ? { isActive: true } : {};
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: pattern }, { industry: pattern }, { locations: pattern }];
  }
  if (query.industry) filter.industry = new RegExp(query.industry, "i");
  if (query.location) filter.locations = { $in: String(query.location).split(",") };
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  return filter;
};

const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const formatDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const joinList = (value) => Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
const companyExportColumns = [
  { key: "name", label: "Name", value: (company) => company.name },
  { key: "industry", label: "Industry", value: (company) => company.industry },
  { key: "address", label: "Address", value: (company) => company.address },
  { key: "locations", label: "Locations", value: (company) => joinList(company.locations) },
  { key: "website", label: "Website", value: (company) => company.website },
  { key: "logo", label: "Logo", value: (company) => company.logo },
  { key: "description", label: "Description", value: (company) => company.description },
  { key: "documents", label: "Documents", value: (company) => joinList(company.documents) },
  { key: "contactPerson.name", label: "Contact Person Name", value: (company) => company.contactPerson && company.contactPerson.name },
  { key: "contactPerson.email", label: "Contact Person Email", value: (company) => company.contactPerson && company.contactPerson.email },
  { key: "contactPerson.phone", label: "Contact Person Phone", value: (company) => company.contactPerson && company.contactPerson.phone },
  { key: "isActive", label: "Active", value: (company) => company.isActive },
  { key: "createdBy", label: "Created By", value: (company) => company.createdBy },
  { key: "createdAt", label: "Created At", value: (company) => formatDate(company.createdAt) },
  { key: "updatedAt", label: "Updated At", value: (company) => formatDate(company.updatedAt) },
];
const defaultCompanyExportFields = ["name", "industry", "locations", "website", "isActive"];
const getExportColumns = (fields) => {
  const requested = fields ? String(fields).split(",").map((field) => field.trim()).filter(Boolean) : defaultCompanyExportFields;
  const selected = requested.map((field) => companyExportColumns.find((column) => column.key === field)).filter(Boolean);
  return selected.length ? selected : companyExportColumns.filter((column) => defaultCompanyExportFields.includes(column.key));
};

const fetchGetCompanies = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = companyQuery(req.query);
    const data = await Company.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Company.countDocuments(query);
    return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchCreateCompany = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const company = await Company.create({ ...req.body, createdBy: req.user.mongoId });
    return res.status(201).json({ success: true, message: "Company created", data: company, statusCode: 201 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetCompanyDetail = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ success: false, message: "Company not found", statusCode: 404 });
    return res.status(200).json({ success: true, data: company, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetCompanyFilterOptions = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const companies = await Company.find({}).select("industry locations isActive").lean();
    const data = {
      industry: compactOptions(companies.map((company) => company.industry)),
      location: compactOptions(companies.map((company) => company.locations || [])),
      status: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchUpdateCompany = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: "Company not found", statusCode: 404 });
    return res.status(200).json({ success: true, message: "Company updated", data: company, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchDeleteCompany = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const openJobs = await JobOpening.countDocuments({ company: req.params.id, status: "Open" });
    if (openJobs) return res.status(422).json({ success: false, message: "Cannot delete company with open jobs", statusCode: 422 });
    await Company.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Company deleted", statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchToggleCompany = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found", statusCode: 404 });
    company.isActive = !company.isActive;
    await company.save();
    return res.status(200).json({ success: true, message: "Company status updated", data: company, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchExportCompanies = async (req, res) => {
  if (!requireOps(req, res)) return;
  const companies = await Company.find(companyQuery(req.query)).lean();
  const columns = getExportColumns(req.query.fields);
  const rows = companies.map((company) => columns.reduce((row, column) => ({ ...row, [column.label]: column.value(company) ?? "" }), {}));
  const buffer = await exportExcel({ rows, sheetName: "Companies" });
  res.setHeader("Content-Disposition", "attachment; filename=companies.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
};

const fetchPublicCompanies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = companyQuery(req.query, true);
  const data = await Company.find(query).select("-createdBy").skip((page - 1) * limit).limit(limit).lean();
  const total = await Company.countDocuments(query);
  return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
};

module.exports = { fetchGetCompanies, fetchGetCompanyFilterOptions, fetchCreateCompany, fetchGetCompanyDetail, fetchUpdateCompany, fetchDeleteCompany, fetchToggleCompany, fetchExportCompanies, fetchPublicCompanies };
