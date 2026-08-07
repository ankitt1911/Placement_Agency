const path = require("path");
const Application = require("../models/applicationModel");
const JobOpening = require("../models/jobOpeningModel");
const StudentProfile = require("../models/studentProfileModel");
const { exportExcel } = require("../utils/exportExcel");
const { generateResumePdf } = require("../utils/resumePdf");
const { parseSearchTerms } = require("../utils/searchUtils");

const requireOps = (req, res) => req.user.role === "operations" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);
const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();
const formatDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const joinList = (value, mapper) => {
  if (!Array.isArray(value)) return "";
  return value.map((item) => mapper ? mapper(item) : item).filter(Boolean).join(", ");
};

const applicationExportColumns = [
  { key: "student", label: "Student", value: (application) => application.student && application.student.name },
  { key: "email", label: "Email", value: (application) => application.student && application.student.email },
  { key: "company", label: "Company", value: (application) => application.job && application.job.company && application.job.company.name },
  { key: "role", label: "Role", value: (application) => application.job && application.job.title },
  { key: "status", label: "Status", value: (application) => application.status },
  { key: "appliedAt", label: "Applied At", value: (application) => formatDate(application.appliedAt) },
  { key: "appliedFromOpenLink", label: "Applied From Open Link", value: (application) => application.appliedFromOpenLink ? "Yes" : "No" },
  { key: "resumeUsed", label: "Resume Used", value: (application) => application.resumeUsed },
  { key: "updatedBy", label: "Updated By", value: (application) => application.updatedBy },
  { key: "notes", label: "Notes", value: (application) => joinList(application.notes, (note) => [note.text, formatDate(note.date)].filter(Boolean).join(" | ")) },
  { key: "createdAt", label: "Application Created At", value: (application) => formatDate(application.createdAt) },
  { key: "updatedAt", label: "Application Updated At", value: (application) => formatDate(application.updatedAt) },
];

const studentProfileExportColumns = [
  { key: "studentProfile.dob", label: "Date of Birth", value: (application) => formatDate(application.student && application.student.dob) },
  { key: "studentProfile.gender", label: "Gender", value: (application) => application.student && application.student.gender },
  { key: "studentProfile.mobile", label: "Mobile", value: (application) => application.student && application.student.mobile },
  { key: "studentProfile.address", label: "Address", value: (application) => application.student && application.student.address },
  { key: "studentProfile.profilePhoto", label: "Profile Photo", value: (application) => application.student && application.student.profilePhoto },
  { key: "studentProfile.education.tenth.percentage", label: "10th Percentage", value: (application) => application.student && application.student.education && application.student.education.tenth && application.student.education.tenth.percentage },
  { key: "studentProfile.education.tenth.year", label: "10th Year", value: (application) => application.student && application.student.education && application.student.education.tenth && application.student.education.tenth.year },
  { key: "studentProfile.education.tenth.board", label: "10th Board", value: (application) => application.student && application.student.education && application.student.education.tenth && application.student.education.tenth.board },
  { key: "studentProfile.education.twelfth.percentage", label: "12th Percentage", value: (application) => application.student && application.student.education && application.student.education.twelfth && application.student.education.twelfth.percentage },
  { key: "studentProfile.education.twelfth.year", label: "12th Year", value: (application) => application.student && application.student.education && application.student.education.twelfth && application.student.education.twelfth.year },
  { key: "studentProfile.education.twelfth.board", label: "12th Board", value: (application) => application.student && application.student.education && application.student.education.twelfth && application.student.education.twelfth.board },
  { key: "studentProfile.education.diploma.college", label: "Diploma College", value: (application) => application.student && application.student.education && application.student.education.diploma && application.student.education.diploma.college },
  { key: "studentProfile.education.diploma.university", label: "Diploma University", value: (application) => application.student && application.student.education && application.student.education.diploma && application.student.education.diploma.university },
  { key: "studentProfile.education.diploma.branch", label: "Diploma Branch", value: (application) => application.student && application.student.education && application.student.education.diploma && application.student.education.diploma.branch },
  { key: "studentProfile.education.diploma.cgpa", label: "Diploma CGPA", value: (application) => application.student && application.student.education && application.student.education.diploma && application.student.education.diploma.cgpa },
  { key: "studentProfile.education.diploma.passingYear", label: "Diploma Passing Year", value: (application) => application.student && application.student.education && application.student.education.diploma && application.student.education.diploma.passingYear },
  { key: "studentProfile.education.graduation.college", label: "Graduation College", value: (application) => application.student && application.student.education && application.student.education.graduation && application.student.education.graduation.college },
  { key: "studentProfile.education.graduation.university", label: "Graduation University", value: (application) => application.student && application.student.education && application.student.education.graduation && application.student.education.graduation.university },
  { key: "studentProfile.education.graduation.branch", label: "Graduation Branch", value: (application) => application.student && application.student.education && application.student.education.graduation && application.student.education.graduation.branch },
  { key: "studentProfile.education.graduation.cgpa", label: "Graduation CGPA", value: (application) => application.student && application.student.education && application.student.education.graduation && application.student.education.graduation.cgpa },
  { key: "studentProfile.education.graduation.passingYear", label: "Graduation Passing Year", value: (application) => application.student && application.student.education && application.student.education.graduation && application.student.education.graduation.passingYear },
  { key: "studentProfile.education.postGraduation.college", label: "Post Graduation College", value: (application) => application.student && application.student.education && application.student.education.postGraduation && application.student.education.postGraduation.college },
  { key: "studentProfile.education.postGraduation.university", label: "Post Graduation University", value: (application) => application.student && application.student.education && application.student.education.postGraduation && application.student.education.postGraduation.university },
  { key: "studentProfile.education.postGraduation.branch", label: "Post Graduation Branch", value: (application) => application.student && application.student.education && application.student.education.postGraduation && application.student.education.postGraduation.branch },
  { key: "studentProfile.education.postGraduation.cgpa", label: "Post Graduation CGPA", value: (application) => application.student && application.student.education && application.student.education.postGraduation && application.student.education.postGraduation.cgpa },
  { key: "studentProfile.education.postGraduation.passingYear", label: "Post Graduation Passing Year", value: (application) => application.student && application.student.education && application.student.education.postGraduation && application.student.education.postGraduation.passingYear },
  { key: "studentProfile.academicDetails.college", label: "College", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.college },
  { key: "studentProfile.academicDetails.university", label: "University", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.university },
  { key: "studentProfile.academicDetails.branch", label: "Branch", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.branch },
  { key: "studentProfile.academicDetails.cgpa", label: "CGPA", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.cgpa },
  { key: "studentProfile.academicDetails.percentage", label: "Percentage", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.percentage },
  { key: "studentProfile.academicDetails.passingYear", label: "Passing Year", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.passingYear },
  { key: "studentProfile.academicDetails.placementEligibility", label: "Placement Eligibility", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.placementEligibility },
  { key: "studentProfile.academicDetails.activeBacklogs", label: "Active Backlogs", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.activeBacklogs },
  { key: "studentProfile.academicDetails.totalBacklogs", label: "Total Backlogs", value: (application) => application.student && application.student.academicDetails && application.student.academicDetails.totalBacklogs },
  { key: "studentProfile.technicalSkills", label: "Technical Skills", value: (application) => application.student && joinList(application.student.technicalSkills) },
  { key: "studentProfile.softSkills", label: "Soft Skills", value: (application) => application.student && joinList(application.student.softSkills) },
  { key: "studentProfile.languages", label: "Languages", value: (application) => application.student && joinList(application.student.languages, (item) => [item.language, item.proficiency].filter(Boolean).join(" - ")) },
  { key: "studentProfile.projects", label: "Projects", value: (application) => application.student && joinList(application.student.projects, (item) => [item.title, item.technologies && item.technologies.join("/"), item.link].filter(Boolean).join(" | ")) },
  { key: "studentProfile.internships", label: "Internships", value: (application) => application.student && joinList(application.student.internships, (item) => [item.company, item.role, item.duration].filter(Boolean).join(" | ")) },
  { key: "studentProfile.achievements", label: "Achievements", value: (application) => application.student && joinList(application.student.achievements) },
  { key: "studentProfile.certifications", label: "Certifications", value: (application) => application.student && joinList(application.student.certifications, (item) => [item.name, item.issuer, formatDate(item.date), item.link].filter(Boolean).join(" | ")) },
  { key: "studentProfile.resume", label: "Resume", value: (application) => application.student && application.student.resume },
  { key: "studentProfile.socialLinks.github", label: "Github", value: (application) => application.student && application.student.socialLinks && application.student.socialLinks.github },
  { key: "studentProfile.socialLinks.linkedin", label: "LinkedIn", value: (application) => application.student && application.student.socialLinks && application.student.socialLinks.linkedin },
  { key: "studentProfile.socialLinks.portfolio", label: "Portfolio", value: (application) => application.student && application.student.socialLinks && application.student.socialLinks.portfolio },
  { key: "studentProfile.preferredLocation", label: "Preferred Location", value: (application) => application.student && joinList(application.student.preferredLocation) },
  { key: "studentProfile.expectedSalary", label: "Expected Salary", value: (application) => application.student && application.student.expectedSalary },
  { key: "studentProfile.currentStatus", label: "Current Student Status", value: (application) => application.student && application.student.currentStatus },
  { key: "studentProfile.subscriptionStatus", label: "Subscription Status", value: (application) => application.student && application.student.subscriptionStatus },
  { key: "studentProfile.createdAt", label: "Student Profile Created At", value: (application) => application.student && formatDate(application.student.createdAt) },
  { key: "studentProfile.updatedAt", label: "Student Profile Updated At", value: (application) => application.student && formatDate(application.student.updatedAt) },
];
const exportColumns = [...applicationExportColumns, ...studentProfileExportColumns];
const defaultApplicationExportFields = ["student", "email", "company", "role", "status", "appliedAt"];
const getExportColumns = (fields) => {
  const requested = fields ? String(fields).split(",").map((field) => field.trim()).filter(Boolean) : defaultApplicationExportFields;
  const selected = requested.map((field) => exportColumns.find((column) => column.key === field)).filter(Boolean);
  return selected.length ? selected : exportColumns.filter((column) => defaultApplicationExportFields.includes(column.key));
};

const withStudentProfiles = async (applications) => {
  const userIds = applications.map((application) => application.student && application.student._id).filter(Boolean);
  const profiles = await StudentProfile.find({ user: { $in: userIds } }).lean();
  const profileByUser = new Map(profiles.map((profile) => [String(profile.user), profile]));

  return applications.map((application) => {
    const student = application.student || {};
    const profile = profileByUser.get(String(student._id)) || {};
    return {
      ...application,
      student: {
        ...profile,
        user: student,
        name: profile.name || student.name,
        email: student.email,
      },
    };
  });
};

const fetchGetApplications = async (req, res) => {
  if (!requireOps(req, res)) return;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.appliedFromOpenLink !== undefined) query.appliedFromOpenLink = String(req.query.appliedFromOpenLink) === "true";
  const applications = await Application.find(query).populate("student", "name email").populate({ path: "job", populate: { path: "company", select: "name locations" } }).sort({ appliedAt: -1 }).lean();
  const enriched = await withStudentProfiles(applications);
  const searchTerms = parseSearchTerms(req.query.search).map((term) => term.toLowerCase());
  const filtered = enriched
    .filter((application) => !req.query.company || String(application.job && application.job.company && application.job.company._id) === String(req.query.company))
    .filter((application) => !req.query.college || String(application.student && application.student.academicDetails && application.student.academicDetails.college) === String(req.query.college))
    .filter((application) => !req.query.role || String(application.job && application.job.title) === String(req.query.role))
    .filter((application) => {
      if (!req.query.location) return true;
      const companyLocations = (application.job && application.job.company && application.job.company.locations) || [];
      const jobLocations = (application.job && application.job.location) || [];
      return [...companyLocations, ...jobLocations].includes(req.query.location);
    })
    .filter((application) => searchTerms.every((term) => [
      application.student && application.student.name,
      application.student && application.student.email,
      application.student && application.student.academicDetails && application.student.academicDetails.college,
      application.student && joinList(application.student.technicalSkills),
      application.job && application.job.title,
      application.job && application.job.company && application.job.company.name,
    ].some((value) => String(value || "").toLowerCase().includes(term))));
  const data = filtered.slice((page - 1) * limit, page * limit);
  return res.status(200).json({ success: true, total: filtered.length, page, limit, data, statusCode: 200 });
};

const fetchGetApplicationDetail = async (req, res) => {
  if (!requireOps(req, res)) return;
  const application = await Application.findById(req.params.id).populate("student", "name email").populate({ path: "job", populate: { path: "company" } }).lean();
  if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });
  const data = (await withStudentProfiles([application]))[0];
  return res.status(200).json({ success: true, data, statusCode: 200 });
};

const fetchUpdateApplicationStatus = async (req, res) => {
  if (!requireOps(req, res)) return;
  const update = { $set: { status: req.body.status, updatedBy: req.user.mongoId } };
  if (req.body.note) update.$push = { notes: { text: req.body.note, updatedBy: req.user.mongoId, date: new Date() } };
  const application = await Application.findByIdAndUpdate(req.params.id, update, { new: true }).populate("student", "name email").populate({ path: "job", populate: { path: "company", select: "name locations" } }).lean();
  if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });
  const data = (await withStudentProfiles([application]))[0];
  return res.status(200).json({ success: true, message: "Application status updated", data, statusCode: 200 });
};

// Withdrawn is student-owned, so ops cannot move those applications on, and an
// application already sitting on the target status is left alone rather than
// stamped with a fresh updatedBy for no change.
const partitionBulkStatusUpdate = (applicationIds, applications, status) => {
  const applicationById = new Map(applications.map((application) => [String(application._id), application]));
  const eligible = [];
  const skipped = [];

  applicationIds.forEach((id) => {
    const application = applicationById.get(String(id));
    if (!application) skipped.push({ application: String(id), reason: "Application not found" });
    else if (application.status === status) skipped.push({ application: String(id), reason: `Already ${status}` });
    else if (application.status === "Withdrawn") skipped.push({ application: String(id), reason: "Application withdrawn" });
    else eligible.push(String(id));
  });

  return { eligible, skipped };
};

const fetchBulkUpdateApplicationStatus = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const { applications: applicationIds, status, note } = req.body;

    const applications = await Application.find({ _id: { $in: applicationIds } }).select("status").lean();
    const { eligible, skipped } = partitionBulkStatusUpdate(applicationIds, applications, status);
    if (!eligible.length) return res.status(422).json({ success: false, message: "No applications to update", updated: 0, skipped, data: [], statusCode: 422 });

    const update = { $set: { status, updatedBy: req.user.mongoId } };
    if (note) update.$push = { notes: { text: note, updatedBy: req.user.mongoId, date: new Date() } };
    await Application.updateMany({ _id: { $in: eligible } }, update);

    const updated = await Application.find({ _id: { $in: eligible } })
      .populate("student", "name email")
      .populate({ path: "job", populate: { path: "company", select: "name locations" } })
      .lean();
    const data = await withStudentProfiles(updated);
    return res.status(200).json({ success: true, message: `${data.length} application${data.length === 1 ? "" : "s"} updated`, updated: data.length, skipped, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchGetApplicationFilterOptions = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const query = {};
    if (req.query.appliedFromOpenLink !== undefined) query.appliedFromOpenLink = String(req.query.appliedFromOpenLink) === "true";
    const applications = await Application.find(query).populate("student", "name email").populate({ path: "job", populate: { path: "company", select: "name locations" } }).select("status job student").lean();
    const enriched = await withStudentProfiles(applications);
    const companies = applications.map((application) => application.job && application.job.company).filter(Boolean);
    // On the open-link tab the role options only make sense for openings that are
    // actually collecting open-link applications.
    const openingQuery = { status: "Open" };
    if (String(req.query.appliedFromOpenLink) === "true") openingQuery["openLink.isActive"] = true;
    const activeOpenings = await JobOpening.find(openingQuery).select("title").lean();
    const data = {
      company: companies.map((company) => ({ label: company.name, value: String(company._id) })).filter((option, index, options) => options.findIndex((item) => item.value === option.value) === index).sort((a, b) => a.label.localeCompare(b.label)),
      role: compactOptions(activeOpenings.map((opening) => opening.title)),
      college: compactOptions(enriched.map((application) => application.student && application.student.academicDetails && application.student.academicDetails.college)),
      status: compactOptions(applications.map((application) => application.status)),
      location: compactOptions(applications.map((application) => [
        ...((application.job && application.job.company && application.job.company.locations) || []),
        ...((application.job && application.job.location) || []),
      ])),
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchExportApplications = async (req, res) => {
  if (!requireOps(req, res)) return;
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.appliedFromOpenLink !== undefined) query.appliedFromOpenLink = String(req.query.appliedFromOpenLink) === "true";
  const applications = await Application.find(query).populate("student", "name email").populate({ path: "job", populate: { path: "company", select: "name locations" } }).lean();
  const enriched = await withStudentProfiles(applications);
  const searchTerms = parseSearchTerms(req.query.search).map((term) => term.toLowerCase());
  const filtered = enriched
    .filter((application) => !req.query.company || String(application.job && application.job.company && application.job.company._id) === String(req.query.company))
    .filter((application) => !req.query.college || String(application.student && application.student.academicDetails && application.student.academicDetails.college) === String(req.query.college))
    .filter((application) => !req.query.role || String(application.job && application.job.title) === String(req.query.role))
    .filter((application) => {
      if (!req.query.location) return true;
      const companyLocations = (application.job && application.job.company && application.job.company.locations) || [];
      const jobLocations = (application.job && application.job.location) || [];
      return [...companyLocations, ...jobLocations].includes(req.query.location);
    })
    .filter((application) => searchTerms.every((term) => [
      application.student && application.student.name,
      application.student && application.student.email,
      application.student && application.student.academicDetails && application.student.academicDetails.college,
      application.student && joinList(application.student.technicalSkills),
      application.job && application.job.title,
      application.job && application.job.company && application.job.company.name,
    ].some((value) => String(value || "").toLowerCase().includes(term))));
  const columns = getExportColumns(req.query.fields);
  const rows = filtered.map((application) => columns.reduce((row, column) => ({ ...row, [column.label]: column.value(application) ?? "" }), {}));
  const buffer = await exportExcel({ rows, sheetName: "Applications" });
  res.setHeader("Content-Disposition", "attachment; filename=applications.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
};

const fetchDownloadApplicationResume = async (req, res) => {
  if (!requireOps(req, res)) return;
  const application = await Application.findById(req.params.id).lean();
  if (!application || !application.resumeUsed) return res.status(404).json({ success: false, message: "Resume not found", statusCode: 404 });
  return res.download(path.join(__dirname, "..", application.resumeUsed.replace(/^\//, "")));
};

// The applicant's resume is rebuilt from their live profile, so the same
// generated CV backs both the applied-students and open-link listings.
const fetchGenerateApplicationResume = async (req, res) => {
  if (!requireOps(req, res)) return;
  const application = await Application.findById(req.params.id).populate("student", "name email").lean();
  if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });
  const user = application.student || {};
  const profile = (await StudentProfile.findOne({ user: user._id }).lean()) || {};
  if (!profile._id && !user.name && !user.email) return res.status(404).json({ success: false, message: "Student profile not found", statusCode: 404 });
  const { buffer, fileName } = await generateResumePdf(profile, user);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  return res.send(buffer);
};

module.exports = { fetchGetApplications, fetchGetApplicationFilterOptions, fetchGetApplicationDetail, fetchUpdateApplicationStatus, fetchBulkUpdateApplicationStatus, fetchExportApplications, fetchDownloadApplicationResume, fetchGenerateApplicationResume };
