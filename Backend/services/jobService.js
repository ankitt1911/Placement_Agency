const JobOpening = require("../models/jobOpeningModel");
const Company = require("../models/companyModel");
const Application = require("../models/applicationModel");
const StudentProfile = require("../models/studentProfileModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { parseSearchTerms, regexForTerm } = require("../utils/searchUtils");

const pageValues = (query) => ({ page: parseInt(query.page) || 1, limit: parseInt(query.limit) || 10 });
const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const categoryOptions = ["IT", "Non-IT"];
const currentApplicationStatus = (application) => application && application.status !== "Withdrawn" ? application.status : null;
const buildJobQuery = async (query) => {
  const filter = { status: "Open" };
  const searchTerms = parseSearchTerms(query.search);
  if (searchTerms.length) filter.$and = await Promise.all(searchTerms.map(async (term) => {
    const pattern = regexForTerm(term);
    const companies = await Company.find({ name: pattern }).select("_id").lean();
    return { $or: [{ title: pattern }, { skills: pattern }, { company: { $in: companies.map((company) => company._id) } }] };
  }));
  if (query.company) filter.company = query.company;
  if (query.role) filter.title = new RegExp(query.role, "i");
  if (query.location) filter.location = { $in: String(query.location).split(",") };
  if (query.skills) filter.skills = { $in: String(query.skills).split(",") };
  if (query.languages) filter.languages = { $in: String(query.languages).split(",") };
  if (query.jobType) filter.jobType = query.jobType;
  if (query.category) filter.category = query.category;
  if (query.salaryMin) filter["salary.min"] = { $gte: Number(query.salaryMin) };
  if (query.salaryMax) filter["salary.max"] = { $lte: Number(query.salaryMax) };
  if (query.experience) filter.experience = { $lte: Number(query.experience) };
  return filter;
};

const fetchPublicJobs = async (req, res) => {
  try {
    const { page, limit } = pageValues(req.query);
    const activeCompanies = await Company.find({ isActive: true }).select("_id").lean();
    const query = { ...(await buildJobQuery(req.query)), company: { $in: activeCompanies.map((company) => company._id) } };
    const data = await JobOpening.find(query).populate("company", "name industry locations website logo").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await JobOpening.countDocuments(query);
    return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetOpenings = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const { page, limit } = pageValues(req.query);
    const activeCompanies = await Company.find({ isActive: true }).select("_id").lean();
    const query = { ...(await buildJobQuery(req.query)), company: { $in: activeCompanies.map((company) => company._id) } };
    const jobs = await JobOpening.find(query).populate("company", "name industry locations website logo isActive").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const applied = await Application.find({ student: req.user.mongoId, job: { $in: jobs.map((job) => job._id) } }).select("job status").lean();
    const statusByJob = new Map(applied.map((item) => [String(item.job), currentApplicationStatus(item)]));
    const data = jobs.map((job) => ({ ...job, applicationStatus: statusByJob.get(String(job._id)) || null }));
    const total = await JobOpening.countDocuments(query);
    return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetOpeningFilterOptions = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const activeCompanies = await Company.find({ isActive: true }).select("_id").lean();
    const jobs = await JobOpening.find({ status: "Open", company: { $in: activeCompanies.map((company) => company._id) } }).select("location skills languages jobType category").lean();
    const data = {
      location: compactOptions(jobs.map((job) => job.location || [])),
      skills: compactOptions(jobs.map((job) => job.skills || [])),
      languages: compactOptions(jobs.map((job) => job.languages || [])),
      jobType: compactOptions(jobs.map((job) => job.jobType)),
      category: categoryOptions,
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetOpeningDetail = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const job = await JobOpening.findOne({ _id: req.params.id, status: "Open" }).populate("company", "name industry locations website logo description isActive").lean();
    if (!job || !job.company || !job.company.isActive) return res.status(404).json({ success: false, message: "Opening not found", statusCode: 404 });
    const application = await Application.findOne({ student: req.user.mongoId, job: job._id }).select("status").lean();
    return res.status(200).json({ success: true, data: { ...job, applicationStatus: currentApplicationStatus(application) }, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchApplyJob = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const profile = await StudentProfile.findOne({ user: req.user.mongoId }).lean();
    const job = await JobOpening.findById(req.params.jobId).populate("company", "isActive").lean();
    if (!job || job.status !== "Open" || !job.company.isActive) return res.status(404).json({ success: false, message: "Open job not found", statusCode: 404 });
    if (job.applicationDeadline && job.applicationDeadline < new Date()) return res.status(422).json({ success: false, message: "Application deadline has passed", statusCode: 422 });
    const exists = await Application.findOne({ student: req.user.mongoId, job: job._id });
    if (exists && exists.status !== "Withdrawn") return res.status(422).json({ success: false, message: "Already applied to this job", statusCode: 422 });
    if (exists) {
      exists.status = "Applied";
      exists.appliedAt = new Date();
      exists.resumeUsed = profile && profile.resume;
      exists.appliedFromOpenLink = false;
      await exists.save();
      return res.status(200).json({ success: true, message: "Applied successfully", data: exists, statusCode: 200 });
    }
    const application = await Application.create({ student: req.user.mongoId, job: job._id, resumeUsed: profile && profile.resume });
    return res.status(201).json({ success: true, message: "Applied successfully", data: application, statusCode: 201 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const isOpenLinkUsable = (job) => {
  if (!job || job.status !== "Open" || !job.openLink || !job.openLink.isActive) return false;
  if (job.openLink.expiresAt && new Date(job.openLink.expiresAt) < new Date()) return false;
  return true;
};

const fetchGetOpenLinkOpening = async (req, res) => {
  try {
    const job = await JobOpening.findById(req.params.id).populate("company", "name industry locations website logo description isActive").lean();
    if (!isOpenLinkUsable(job) || !job.company || !job.company.isActive) return res.status(404).json({ success: false, message: "Open link is not active", statusCode: 404 });
    return res.status(200).json({ success: true, data: job, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchApplyViaOpenLink = async (req, res) => {
  try {
    const job = await JobOpening.findById(req.params.id).populate("company", "isActive").lean();
    if (!isOpenLinkUsable(job) || !job.company || !job.company.isActive) return res.status(404).json({ success: false, message: "Open link is not active", statusCode: 404 });
    if (job.applicationDeadline && job.applicationDeadline < new Date()) return res.status(422).json({ success: false, message: "Application deadline has passed", statusCode: 422 });

    const email = String(req.body.email || req.body.user?.email || "").trim().toLowerCase();
    const name = String(req.body.name || "").trim();
    if (!email || !name) return res.status(422).json({ success: false, message: "Name and email are required", statusCode: 422 });

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = await bcrypt.hash(`${email}-${Date.now()}-${Math.random()}`, 10);
      user = await User.create({ email, name, password: randomPassword, role: "student" });
    }
    if (user.role !== "student") return res.status(422).json({ success: false, message: "This email cannot be used for student application", statusCode: 422 });

    const exists = await Application.findOne({ student: user._id, job: job._id });
    if (exists && exists.status !== "Withdrawn") return res.status(422).json({ success: false, message: "Already applied to this job", statusCode: 422 });

    const profilePayload = {
      name,
      dob: req.body.dob,
      gender: req.body.gender,
      mobile: req.body.mobile,
      address: req.body.address,
      education: req.body.education || {},
      academicDetails: req.body.academicDetails || {},
      technicalSkills: Array.isArray(req.body.technicalSkills) ? req.body.technicalSkills : String(req.body.technicalSkills || "").split(",").map((item) => item.trim()).filter(Boolean),
      softSkills: Array.isArray(req.body.softSkills) ? req.body.softSkills : String(req.body.softSkills || "").split(",").map((item) => item.trim()).filter(Boolean),
      languages: req.body.languages || [],
      projects: req.body.projects || [],
      internships: req.body.internships || [],
      totalExperience: req.body.totalExperience,
      achievements: Array.isArray(req.body.achievements) ? req.body.achievements : String(req.body.achievements || "").split(",").map((item) => item.trim()).filter(Boolean),
      certifications: req.body.certifications || [],
      resume: req.body.resume,
      socialLinks: req.body.socialLinks || {},
      preferredLocation: Array.isArray(req.body.preferredLocation) ? req.body.preferredLocation : String(req.body.preferredLocation || "").split(",").map((item) => item.trim()).filter(Boolean),
      expectedSalary: req.body.expectedSalary,
      currentStatus: req.body.currentStatus || "Available",
      subscriptionStatus: req.body.subscriptionStatus || "free",
      heardAbout: req.body.heardAbout || {},
    };

    const profile = await StudentProfile.findOneAndUpdate(
      { user: user._id },
      { $set: { ...profilePayload, user: user._id } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    if (!user.profile) {
      user.profile = profile._id;
      user.name = user.name || name;
      await user.save();
    }

    if (exists) {
      exists.status = "Applied";
      exists.appliedAt = new Date();
      exists.resumeUsed = profile.resume;
      exists.appliedFromOpenLink = true;
      await exists.save();
      return res.status(200).json({ success: true, message: "Application submitted successfully", data: exists, statusCode: 200 });
    }

    const application = await Application.create({ student: user._id, job: job._id, resumeUsed: profile.resume, appliedFromOpenLink: true });
    return res.status(201).json({ success: true, message: "Application submitted successfully", data: application, statusCode: 201 });
  } catch (error) {
    if (error.code === 11000) return res.status(422).json({ success: false, message: "Already applied to this job", statusCode: 422 });
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

module.exports = { fetchPublicJobs, fetchGetOpenings, fetchGetOpeningFilterOptions, fetchGetOpeningDetail, fetchApplyJob, fetchGetOpenLinkOpening, fetchApplyViaOpenLink };
