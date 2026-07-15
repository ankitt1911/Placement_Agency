const StudentProfile = require("../models/studentProfileModel");
const Application = require("../models/applicationModel");
const JobOpening = require("../models/jobOpeningModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");

const fetchStudentDashboard = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const profile = await StudentProfile.findOne({ user: req.user.mongoId }).lean();
    const totalApplications = await Application.countDocuments({ student: req.user.mongoId });
    const applicationsByStatus = await Application.aggregate([{ $match: { student: profile ? profile.user : req.user.mongoId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
    const activeCompanies = await Company.find({ isActive: true }).select("_id").lean();
    const latestOpenJobs = await JobOpening.find({ status: "Open", company: { $in: activeCompanies.map((company) => company._id) } }).populate("company", "name industry locations website logo isActive").sort({ createdAt: -1 }).limit(5).lean();
    const recentApplications = await Application.find({ student: req.user.mongoId }).populate({ path: "job", populate: { path: "company", select: "name locations" } }).sort({ appliedAt: -1 }).limit(5).lean();
    const fields = ["name", "mobile", "resume", "academicDetails", "technicalSkills"];
    const completed = fields.filter((field) => profile && profile[field] && (!Array.isArray(profile[field]) || profile[field].length)).length;
    return res.status(200).json({
      success: true,
      data: {
        profileCompletion: Math.round((completed / fields.length) * 100),
        totalApplications,
        applicationsByStatus,
        latestOpenJobs,
        recentApplications,
        resumeUploaded: Boolean(profile && profile.resume),
      },
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchOpsDashboard = async (req, res) => {
  try {
    if (req.user.role !== "operations") return res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    const statusCounts = await Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const statusCount = new Map(statusCounts.map((item) => [item._id, item.count]));
    const openLinkStudentIds = await Application.distinct("student", { appliedFromOpenLink: true });
    const data = {
      students: await User.countDocuments({ role: "student" }),
      activeStudents: await User.countDocuments({ role: "student", isActive: true }),
      companies: await Company.countDocuments(),
      activeCompanies: await Company.countDocuments({ isActive: true }),
      openJobs: await JobOpening.countDocuments({ status: "Open" }),
      closedJobs: await JobOpening.countDocuments({ status: "Closed" }),
      applications: await Application.countDocuments(),
      openLinkStudents: openLinkStudentIds.length,
      openLinkApplications: await Application.countDocuments({ appliedFromOpenLink: true }),
      shortlistedSelected: (statusCount.get("Shortlisted") || 0) + (statusCount.get("Selected") || 0),
      applicationsByStatus: statusCounts,
      latestOpenJobs: await JobOpening.find({ status: "Open" }).populate("company", "name industry locations").sort({ createdAt: -1 }).limit(5).lean(),
      recentApplications: await Application.find({}).populate("student", "name email").populate({ path: "job", populate: { path: "company", select: "name locations" } }).sort({ appliedAt: -1 }).limit(5).lean(),
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

module.exports = { fetchStudentDashboard, fetchOpsDashboard };
