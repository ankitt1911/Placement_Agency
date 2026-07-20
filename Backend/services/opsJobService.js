const JobOpening = require("../models/jobOpeningModel");
const Company = require("../models/companyModel");
const Application = require("../models/applicationModel");
const { exportExcel } = require("../utils/exportExcel");
const { parseSearchTerms, regexForTerm } = require("../utils/searchUtils");

const requireOps = (req, res) => req.user.role === "operations" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);
const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const categoryOptions = ["IT", "Non-IT"];
const formatDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const joinList = (value) => Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
const jobExportColumns = [
  { key: "company", label: "Company", value: (job) => job.company && job.company.name },
  { key: "companyId", label: "Company ID", value: (job) => job.company && job.company._id },
  { key: "title", label: "Title", value: (job) => job.title },
  { key: "description", label: "Description", value: (job) => job.description },
  { key: "location", label: "Location", value: (job) => joinList(job.location) },
  { key: "skills", label: "Skills", value: (job) => joinList(job.skills) },
  { key: "languages", label: "Languages", value: (job) => joinList(job.languages) },
  { key: "experience", label: "Experience", value: (job) => job.experience },
  { key: "salary.min", label: "Salary Min", value: (job) => job.salary && job.salary.min },
  { key: "salary.max", label: "Salary Max", value: (job) => job.salary && job.salary.max },
  { key: "jobType", label: "Job Type", value: (job) => job.jobType },
  { key: "category", label: "Category", value: (job) => job.category },
  { key: "vacancies", label: "Vacancies", value: (job) => job.vacancies },
  { key: "eligibility.minCGPA", label: "Eligibility Min CGPA", value: (job) => job.eligibility && job.eligibility.minCGPA },
  { key: "eligibility.activeBacklogs", label: "Eligibility Active Backlogs", value: (job) => job.eligibility && job.eligibility.activeBacklogs },
  { key: "eligibility.branches", label: "Eligibility Branches", value: (job) => job.eligibility && joinList(job.eligibility.branches) },
  { key: "eligibility.passingYear", label: "Eligibility Passing Year", value: (job) => job.eligibility && joinList(job.eligibility.passingYear) },
  { key: "status", label: "Status", value: (job) => job.status },
  { key: "postedBy", label: "Posted By", value: (job) => job.postedBy },
  { key: "applicationDeadline", label: "Application Deadline", value: (job) => formatDate(job.applicationDeadline) },
  { key: "createdAt", label: "Created At", value: (job) => formatDate(job.createdAt) },
  { key: "updatedAt", label: "Updated At", value: (job) => formatDate(job.updatedAt) },
];
const defaultJobExportFields = ["company", "title", "location", "skills", "vacancies", "status"];
const getExportColumns = (fields) => {
  const requested = fields ? String(fields).split(",").map((field) => field.trim()).filter(Boolean) : defaultJobExportFields;
  const selected = requested.map((field) => jobExportColumns.find((column) => column.key === field)).filter(Boolean);
  return selected.length ? selected : jobExportColumns.filter((column) => defaultJobExportFields.includes(column.key));
};

const buildQuery = async (q) => {
  const query = {};
  const searchTerms = parseSearchTerms(q.search);
  if (searchTerms.length) query.$and = await Promise.all(searchTerms.map(async (term) => {
    const pattern = regexForTerm(term);
    const companies = await Company.find({ name: pattern }).select("_id").lean();
    return { $or: [{ company: { $in: companies.map((company) => company._id) } }, { title: pattern }, { location: pattern }, { skills: pattern }] };
  }));
  if (q.company) query.company = q.company;
  if (q.role || q.title) query.title = new RegExp(q.role || q.title, "i");
  if (q.location) query.location = { $in: String(q.location).split(",") };
  if (q.skills) query.skills = { $in: String(q.skills).split(",") };
  if (q.languages) query.languages = { $in: String(q.languages).split(",") };
  if (q.status) query.status = q.status;
  if (q.jobType) query.jobType = q.jobType;
  if (q.category) query.category = q.category;
  if (q.vacancies) query.vacancies = Number(q.vacancies);
  return query;
};

const fetchGetOpsJobs = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = await buildQuery(req.query);
    const data = await JobOpening.find(query).populate("company", "name industry isActive").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await JobOpening.countDocuments(query);
    return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchCreateJob = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const company = await Company.findOne({ _id: req.body.company, isActive: true });
    if (!company) return res.status(422).json({ success: false, message: "Active company is required", statusCode: 422 });
    const job = await JobOpening.create({ ...req.body, postedBy: req.user.mongoId });
    return res.status(201).json({ success: true, message: "Job created", data: job, statusCode: 201 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetJobFilterOptions = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const jobs = await JobOpening.find({}).populate("company", "name").select("company location skills languages status jobType category").lean();
    const companies = jobs.map((job) => job.company).filter(Boolean);
    const data = {
      company: companies.map((company) => ({ label: company.name, value: String(company._id) })).filter((option, index, options) => options.findIndex((item) => item.value === option.value) === index).sort((a, b) => a.label.localeCompare(b.label)),
      location: compactOptions(jobs.map((job) => job.location || [])),
      skills: compactOptions(jobs.map((job) => job.skills || [])),
      languages: compactOptions(jobs.map((job) => job.languages || [])),
      status: compactOptions(jobs.map((job) => job.status)),
      jobType: compactOptions(jobs.map((job) => job.jobType)),
      category: categoryOptions,
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetOpsJobDetail = async (req, res) => {
  if (!requireOps(req, res)) return;
  const job = await JobOpening.findById(req.params.id).populate("company").lean();
  if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
  return res.status(200).json({ success: true, data: job, statusCode: 200 });
};

const fetchUpdateJob = async (req, res) => {
  if (!requireOps(req, res)) return;
  const job = await JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Job updated", data: job, statusCode: 200 });
};

const fetchDeleteJob = async (req, res) => {
  if (!requireOps(req, res)) return;
  const count = await Application.countDocuments({ job: req.params.id });
  if (count) return res.status(422).json({ success: false, message: "Cannot delete job with applications", statusCode: 422 });
  await JobOpening.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: "Job deleted", statusCode: 200 });
};

const fetchCloseJob = async (req, res) => fetchUpdateJob({ ...req, body: { status: "Closed" } }, res);
const fetchReopenJob = async (req, res) => fetchUpdateJob({ ...req, body: { status: "Open" } }, res);

const fetchUpdateOpenLink = async (req, res) => {
  if (!requireOps(req, res)) return;
  const expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) return res.status(422).json({ success: false, message: "Valid expiry date is required", statusCode: 422 });
  if (expiresAt) {
    expiresAt.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiresAt < today) return res.status(422).json({ success: false, message: "Expiry date cannot be in the past", statusCode: 422 });
  }
  const job = await JobOpening.findByIdAndUpdate(req.params.id, {
    $set: {
      "openLink.isActive": req.body.isActive !== false,
      "openLink.expiresAt": expiresAt,
      "openLink.createdBy": req.user.mongoId,
      "openLink.updatedBy": req.user.mongoId,
    },
  }, { new: true, runValidators: true }).populate("company", "name industry isActive").lean();
  if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Open link updated", data: job, statusCode: 200 });
};

const fetchCloseOpenLink = async (req, res) => {
  if (!requireOps(req, res)) return;
  const job = await JobOpening.findByIdAndUpdate(req.params.id, {
    $set: { "openLink.isActive": false, "openLink.updatedBy": req.user.mongoId },
  }, { new: true }).populate("company", "name industry isActive").lean();
  if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Open link closed", data: job, statusCode: 200 });
};

const fetchDuplicateJob = async (req, res) => {
  if (!requireOps(req, res)) return;
  const job = await JobOpening.findById(req.params.id).lean();
  if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
  delete job._id;
  const duplicate = await JobOpening.create({ ...job, status: "Draft", postedBy: req.user.mongoId });
  return res.status(201).json({ success: true, message: "Job duplicated", data: duplicate, statusCode: 201 });
};

const fetchGetJobApplicants = async (req, res) => {
  if (!requireOps(req, res)) return;
  const data = await Application.find({ job: req.params.id }).populate("student", "name email isActive").populate({ path: "job", select: "title" }).lean();
  return res.status(200).json({ success: true, data, statusCode: 200 });
};

const fetchExportJobs = async (req, res) => {
  if (!requireOps(req, res)) return;
  const jobs = await JobOpening.find(await buildQuery(req.query)).populate("company", "name").lean();
  const columns = getExportColumns(req.query.fields);
  const rows = jobs.map((job) => columns.reduce((row, column) => ({ ...row, [column.label]: column.value(job) ?? "" }), {}));
  const buffer = await exportExcel({ rows, sheetName: "Jobs" });
  res.setHeader("Content-Disposition", "attachment; filename=jobs.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
};

module.exports = { fetchGetOpsJobs, fetchGetJobFilterOptions, fetchCreateJob, fetchGetOpsJobDetail, fetchUpdateJob, fetchDeleteJob, fetchCloseJob, fetchReopenJob, fetchUpdateOpenLink, fetchCloseOpenLink, fetchDuplicateJob, fetchGetJobApplicants, fetchExportJobs };
