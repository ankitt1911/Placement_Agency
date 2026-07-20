const Application = require("../models/applicationModel");
const Company = require("../models/companyModel");
const JobOpening = require("../models/jobOpeningModel");
const { parseSearchTerms, regexForTerm } = require("../utils/searchUtils");

const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const fetchMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = { student: req.user.mongoId };
    if (req.query.status) query.status = req.query.status;
    const searchTerms = parseSearchTerms(req.query.search);
    if (searchTerms.length) query.$and = await Promise.all(searchTerms.map(async (term) => {
      const pattern = regexForTerm(term);
      const companies = await Company.find({ name: pattern }).select("_id").lean();
      const jobs = await JobOpening.find({ $or: [{ title: pattern }, { location: pattern }, { company: { $in: companies.map((company) => company._id) } }] }).select("_id").lean();
      return { $or: [{ status: pattern }, { job: { $in: jobs.map((job) => job._id) } }] };
    }));
    const data = await Application.find(query).populate({ path: "job", populate: { path: "company", select: "name industry locations" } }).sort({ appliedAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Application.countDocuments(query);
    return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchMyApplicationFilterOptions = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const applications = await Application.find({ student: req.user.mongoId }).select("status").lean();
    const data = { status: compactOptions(applications.map((application) => application.status)) };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchMyApplicationDetail = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const application = await Application.findOne({ _id: req.params.id, student: req.user.mongoId }).populate({ path: "job", populate: { path: "company" } }).lean();
    if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });
    return res.status(200).json({ success: true, data: application, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchWithdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const application = await Application.findOne({ _id: req.params.id, student: req.user.mongoId });
    if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });
    if (["Selected", "Rejected"].includes(application.status)) return res.status(422).json({ success: false, message: "This application can no longer be withdrawn", statusCode: 422 });
    application.status = "Withdrawn";
    await application.save();
    return res.status(200).json({ success: true, message: "Application withdrawn", data: application, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

module.exports = { fetchMyApplications, fetchMyApplicationFilterOptions, fetchMyApplicationDetail, fetchWithdrawApplication };
