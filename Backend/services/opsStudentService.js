const path = require("path");
const User = require("../models/userModel");
const StudentProfile = require("../models/studentProfileModel");
const { exportExcel } = require("../utils/exportExcel");

const requireOps = (req, res) => req.user.role === "operations" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);
const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const formatDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const joinList = (value, mapper) => {
  if (!Array.isArray(value)) return "";
  return value.map((item) => mapper ? mapper(item) : item).filter(Boolean).join(", ");
};
const qualificationOptions = [
  { key: "tenth", label: "tenth" },
  { key: "twelfth", label: "twelfth" },
  { key: "diploma", label: "diploma" },
  { key: "graduation", label: "graduation" },
  { key: "postGraduation", label: "postGraduation" },
];

const studentExportColumns = [
  { key: "name", label: "Name", value: (s) => s.name },
  { key: "email", label: "Email", value: (s) => s.user && s.user.email },
  { key: "dob", label: "Date of Birth", value: (s) => formatDate(s.dob) },
  { key: "gender", label: "Gender", value: (s) => s.gender },
  { key: "mobile", label: "Mobile", value: (s) => s.mobile },
  { key: "address", label: "Address", value: (s) => s.address },
  { key: "profilePhoto", label: "Profile Photo", value: (s) => s.profilePhoto },
  { key: "education.tenth.percentage", label: "10th Percentage", value: (s) => s.education && s.education.tenth && s.education.tenth.percentage },
  { key: "education.tenth.year", label: "10th Year", value: (s) => s.education && s.education.tenth && s.education.tenth.year },
  { key: "education.tenth.board", label: "10th Board", value: (s) => s.education && s.education.tenth && s.education.tenth.board },
  { key: "education.twelfth.percentage", label: "12th Percentage", value: (s) => s.education && s.education.twelfth && s.education.twelfth.percentage },
  { key: "education.twelfth.year", label: "12th Year", value: (s) => s.education && s.education.twelfth && s.education.twelfth.year },
  { key: "education.twelfth.board", label: "12th Board", value: (s) => s.education && s.education.twelfth && s.education.twelfth.board },
  { key: "education.diploma.college", label: "Diploma College", value: (s) => s.education && s.education.diploma && s.education.diploma.college },
  { key: "education.diploma.university", label: "Diploma University", value: (s) => s.education && s.education.diploma && s.education.diploma.university },
  { key: "education.diploma.branch", label: "Diploma Branch", value: (s) => s.education && s.education.diploma && s.education.diploma.branch },
  { key: "education.diploma.cgpa", label: "Diploma CGPA", value: (s) => s.education && s.education.diploma && s.education.diploma.cgpa },
  { key: "education.diploma.passingYear", label: "Diploma Passing Year", value: (s) => s.education && s.education.diploma && s.education.diploma.passingYear },
  { key: "education.graduation.college", label: "Graduation College", value: (s) => s.education && s.education.graduation && s.education.graduation.college },
  { key: "education.graduation.university", label: "Graduation University", value: (s) => s.education && s.education.graduation && s.education.graduation.university },
  { key: "education.graduation.branch", label: "Graduation Branch", value: (s) => s.education && s.education.graduation && s.education.graduation.branch },
  { key: "education.graduation.cgpa", label: "Graduation CGPA", value: (s) => s.education && s.education.graduation && s.education.graduation.cgpa },
  { key: "education.graduation.passingYear", label: "Graduation Passing Year", value: (s) => s.education && s.education.graduation && s.education.graduation.passingYear },
  { key: "education.postGraduation.college", label: "Post Graduation College", value: (s) => s.education && s.education.postGraduation && s.education.postGraduation.college },
  { key: "education.postGraduation.university", label: "Post Graduation University", value: (s) => s.education && s.education.postGraduation && s.education.postGraduation.university },
  { key: "education.postGraduation.branch", label: "Post Graduation Branch", value: (s) => s.education && s.education.postGraduation && s.education.postGraduation.branch },
  { key: "education.postGraduation.cgpa", label: "Post Graduation CGPA", value: (s) => s.education && s.education.postGraduation && s.education.postGraduation.cgpa },
  { key: "education.postGraduation.passingYear", label: "Post Graduation Passing Year", value: (s) => s.education && s.education.postGraduation && s.education.postGraduation.passingYear },
  { key: "academicDetails.college", label: "College", value: (s) => s.academicDetails && s.academicDetails.college },
  { key: "academicDetails.university", label: "University", value: (s) => s.academicDetails && s.academicDetails.university },
  { key: "academicDetails.branch", label: "Branch", value: (s) => s.academicDetails && s.academicDetails.branch },
  { key: "academicDetails.cgpa", label: "CGPA", value: (s) => s.academicDetails && s.academicDetails.cgpa },
  { key: "academicDetails.percentage", label: "Percentage", value: (s) => s.academicDetails && s.academicDetails.percentage },
  { key: "academicDetails.passingYear", label: "Passing Year", value: (s) => s.academicDetails && s.academicDetails.passingYear },
  { key: "academicDetails.placementEligibility", label: "Placement Eligibility", value: (s) => s.academicDetails && s.academicDetails.placementEligibility },
  { key: "academicDetails.activeBacklogs", label: "Active Backlogs", value: (s) => s.academicDetails && s.academicDetails.activeBacklogs },
  { key: "academicDetails.totalBacklogs", label: "Total Backlogs", value: (s) => s.academicDetails && s.academicDetails.totalBacklogs },
  { key: "technicalSkills", label: "Technical Skills", value: (s) => joinList(s.technicalSkills) },
  { key: "softSkills", label: "Soft Skills", value: (s) => joinList(s.softSkills) },
  { key: "languages", label: "Languages", value: (s) => joinList(s.languages, (item) => [item.language, item.proficiency].filter(Boolean).join(" - ")) },
  { key: "projects", label: "Projects", value: (s) => joinList(s.projects, (item) => [item.title, item.technologies && item.technologies.join("/"), item.link].filter(Boolean).join(" | ")) },
  { key: "internships", label: "Internships", value: (s) => joinList(s.internships, (item) => [item.company, item.role, item.duration].filter(Boolean).join(" | ")) },
  { key: "totalExperience", label: "Experience", value: (s) => s.totalExperience },
  { key: "achievements", label: "Achievements", value: (s) => joinList(s.achievements) },
  { key: "certifications", label: "Certifications", value: (s) => joinList(s.certifications, (item) => [item.name, item.issuer, formatDate(item.date), item.link].filter(Boolean).join(" | ")) },
  { key: "resume", label: "Resume", value: (s) => s.resume },
  { key: "socialLinks.github", label: "Github", value: (s) => s.socialLinks && s.socialLinks.github },
  { key: "socialLinks.linkedin", label: "LinkedIn", value: (s) => s.socialLinks && s.socialLinks.linkedin },
  { key: "socialLinks.portfolio", label: "Portfolio", value: (s) => s.socialLinks && s.socialLinks.portfolio },
  { key: "preferredLocation", label: "Preferred Location", value: (s) => joinList(s.preferredLocation) },
  { key: "expectedSalary", label: "Expected Salary", value: (s) => s.expectedSalary },
  { key: "currentStatus", label: "Current Status", value: (s) => s.currentStatus },
  { key: "subscriptionStatus", label: "Subscription Status", value: (s) => s.subscriptionStatus },
  { key: "createdAt", label: "Created At", value: (s) => formatDate(s.createdAt) },
  { key: "updatedAt", label: "Updated At", value: (s) => formatDate(s.updatedAt) },
];
const defaultStudentExportFields = ["name", "email", "mobile", "academicDetails.college", "academicDetails.branch", "academicDetails.cgpa", "technicalSkills", "currentStatus"];
const getExportColumns = (fields) => {
  const requested = fields ? String(fields).split(",").map((field) => field.trim()).filter(Boolean) : defaultStudentExportFields;
  const selected = requested.map((field) => studentExportColumns.find((column) => column.key === field)).filter(Boolean);
  return selected.length ? selected : studentExportColumns.filter((column) => defaultStudentExportFields.includes(column.key));
};

const buildProfileQuery = async (q) => {
  const query = {};
  if (q.search) {
    const pattern = new RegExp(escapeRegex(q.search), "i");
    const users = await User.find({ role: "student", email: pattern }).select("_id").lean();
    query.$or = [
      { name: pattern },
      { user: { $in: users.map((user) => user._id) } },
      { "academicDetails.college": pattern },
      { technicalSkills: pattern },
    ];
  }
  if (q.college) query["academicDetails.college"] = new RegExp(q.college, "i");
  if (q.branch) query["academicDetails.branch"] = new RegExp(q.branch, "i");
  if (q.cgpaMin || q.cgpaMax) query["academicDetails.cgpa"] = {};
  if (q.cgpaMin) query["academicDetails.cgpa"].$gte = Number(q.cgpaMin);
  if (q.cgpaMax) query["academicDetails.cgpa"].$lte = Number(q.cgpaMax);
  if (q.location) query.preferredLocation = { $in: String(q.location).split(",") };
  if (q.skills) query.technicalSkills = { $in: String(q.skills).split(",") };
  if (q.passingYear) query["academicDetails.passingYear"] = Number(q.passingYear);
  if (q.qualification && qualificationOptions.some((option) => option.key === q.qualification)) query[`education.${q.qualification}`] = { $exists: true, $ne: null };
  if (q.backlog !== undefined && q.backlog !== "") query["academicDetails.activeBacklogs"] = Number(q.backlog);
  if (q.subscription) query.subscriptionStatus = q.subscription;
  return query;
};

const fetchGetStudents = async (req, res) => {
  if (!requireOps(req, res)) return;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = await buildProfileQuery(req.query);
  if (req.query.status) {
    const users = await User.find({ role: "student", isActive: req.query.status === "active" }).select("_id").lean();
    query.user = { $in: users.map((user) => user._id) };
  }
  const data = await StudentProfile.find(query).populate("user", "name email isActive role").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  const total = await StudentProfile.countDocuments(query);
  return res.status(200).json({ success: true, total, page, limit, data, statusCode: 200 });
};

const fetchGetStudentDetail = async (req, res) => {
  if (!requireOps(req, res)) return;
  const profile = await StudentProfile.findById(req.params.id).populate("user", "name email isActive role").lean();
  if (!profile) return res.status(404).json({ success: false, message: "Student not found", statusCode: 404 });
  return res.status(200).json({ success: true, data: profile, statusCode: 200 });
};

const fetchGetStudentFilterOptions = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const profiles = await StudentProfile.find({}).populate("user", "isActive").select("academicDetails preferredLocation technicalSkills subscriptionStatus education user").lean();
    const hasActive = profiles.some((profile) => profile.user && profile.user.isActive !== false);
    const hasDisabled = profiles.some((profile) => profile.user && profile.user.isActive === false);
    const data = {
      college: compactOptions(profiles.map((profile) => profile.academicDetails && profile.academicDetails.college)),
      branch: compactOptions(profiles.map((profile) => profile.academicDetails && profile.academicDetails.branch)),
      location: compactOptions(profiles.map((profile) => profile.preferredLocation || [])),
      skills: compactOptions(profiles.map((profile) => profile.technicalSkills || [])),
      passingYear: compactOptions(profiles.map((profile) => profile.academicDetails && profile.academicDetails.passingYear)),
      qualification: qualificationOptions.map((option) => ({ label: option.label, value: option.key })),
      backlog: compactOptions(profiles.map((profile) => profile.academicDetails && profile.academicDetails.activeBacklogs)).map((value) => ({ label: `${value} backlog${Number(value) === 1 ? "" : "s"}`, value })),
      subscription: compactOptions(profiles.map((profile) => profile.subscriptionStatus)),
      status: [
        ...(hasActive ? [{ label: "Active", value: "active" }] : []),
        ...(hasDisabled ? [{ label: "Disabled", value: "disabled" }] : []),
      ],
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchUpdateStudent = async (req, res) => {
  if (!requireOps(req, res)) return;
  const update = { ...req.body };
  delete update.user;
  const profile = await StudentProfile.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!profile) return res.status(404).json({ success: false, message: "Student not found", statusCode: 404 });
  if (update.name) await User.findByIdAndUpdate(profile.user, { name: update.name });
  return res.status(200).json({ success: true, message: "Student updated", data: profile, statusCode: 200 });
};

const setStudentActiveStatus = async (req, res, isActive) => {
  if (!requireOps(req, res)) return;
  const profile = await StudentProfile.findById(req.params.id).populate("user", "isActive");
  if (!profile) return res.status(404).json({ success: false, message: "Student not found", statusCode: 404 });
  const nextIsActive = typeof isActive === "boolean" ? isActive : profile.user && profile.user.isActive === false;
  const user = await User.findByIdAndUpdate(profile.user._id, { isActive: nextIsActive }, { new: true });
  const data = await StudentProfile.findById(req.params.id).populate("user", "name email isActive role").lean();
  return res.status(200).json({ success: true, message: `Student ${user.isActive ? "enabled" : "disabled"}`, data, statusCode: 200 });
};

const fetchDisableStudent = async (req, res) => setStudentActiveStatus(req, res);

const fetchDeleteStudent = async (req, res) => setStudentActiveStatus(req, res, false);

const fetchDownloadStudentResume = async (req, res) => {
  if (!requireOps(req, res)) return;
  const profile = await StudentProfile.findById(req.params.id).lean();
  if (!profile || !profile.resume) return res.status(404).json({ success: false, message: "Resume not found", statusCode: 404 });
  return res.download(path.join(__dirname, "..", profile.resume.replace(/^\//, "")));
};

const fetchExportStudents = async (req, res) => {
  if (!requireOps(req, res)) return;
  const query = await buildProfileQuery(req.query);
  if (req.query.status) {
    const users = await User.find({ role: "student", isActive: req.query.status === "active" }).select("_id").lean();
    query.user = { $in: users.map((user) => user._id) };
  }
  const students = await StudentProfile.find(query).populate("user", "email").lean();
  const columns = getExportColumns(req.query.fields);
  const rows = students.map((student) => columns.reduce((row, column) => ({ ...row, [column.label]: column.value(student) ?? "" }), {}));
  const buffer = await exportExcel({ rows, sheetName: "Students" });
  res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
};

module.exports = { fetchGetStudents, fetchGetStudentFilterOptions, fetchGetStudentDetail, fetchUpdateStudent, fetchDisableStudent, fetchDeleteStudent, fetchDownloadStudentResume, fetchExportStudents };
