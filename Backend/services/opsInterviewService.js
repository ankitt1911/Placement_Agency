const Interview = require("../models/interviewModel");
const Application = require("../models/applicationModel");
const StudentProfile = require("../models/studentProfileModel");
const { exportExcel } = require("../utils/exportExcel");
const { parseSearchTerms } = require("../utils/searchUtils");

const requireOps = (req, res) => req.user.role === "operations" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);
const compactOptions = (values) => [...new Set(values.flat().filter(Boolean).map(String))].sort();

// Renders in the requesting browser's timezone so the sheet matches the calendar.
const formatDateTime = (value, timeZone) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("sv-SE", timeZone ? { timeZone } : undefined).slice(0, 16);
  } catch {
    return new Date(value).toLocaleString("sv-SE").slice(0, 16);
  }
};

const exportColumns = [
  { key: "student", label: "Candidate", value: (interview) => interview.student && interview.student.name },
  { key: "email", label: "Email", value: (interview) => interview.student && interview.student.email },
  { key: "mobile", label: "Mobile", value: (interview) => interview.student && interview.student.mobile },
  { key: "college", label: "College", value: (interview) => interview.student && interview.student.academicDetails && interview.student.academicDetails.college },
  { key: "company", label: "Company", value: (interview) => (interview.company && interview.company.name) || (interview.job && interview.job.company && interview.job.company.name) },
  { key: "role", label: "Role", value: (interview) => interview.job && interview.job.title },
  { key: "round", label: "Round", value: (interview) => interview.round },
  { key: "scheduledAt", label: "Scheduled At", value: (interview, tz) => formatDateTime(interview.scheduledAt, tz) },
  { key: "durationMinutes", label: "Duration (min)", value: (interview) => interview.durationMinutes },
  { key: "mode", label: "Mode", value: (interview) => interview.mode },
  { key: "status", label: "Status", value: (interview) => interview.status },
  { key: "interviewerName", label: "Interviewer", value: (interview) => interview.interviewerName },
  { key: "interviewerEmail", label: "Interviewer Email", value: (interview) => interview.interviewerEmail },
  { key: "meetingLink", label: "Meeting Link", value: (interview) => interview.meetingLink },
  { key: "location", label: "Venue", value: (interview) => interview.location },
  { key: "feedback", label: "Feedback", value: (interview) => interview.feedback },
  { key: "notes", label: "Notes", value: (interview, tz) => (interview.notes || []).map((note) => [note.text, formatDateTime(note.date, tz)].filter(Boolean).join(" | ")).join(", ") },
  { key: "scheduledBy", label: "Scheduled By", value: (interview) => interview.scheduledBy && interview.scheduledBy.name },
  { key: "updatedBy", label: "Last Updated By", value: (interview) => interview.updatedBy && interview.updatedBy.name },
];

const defaultExportFields = ["student", "email", "company", "role", "round", "scheduledAt", "mode", "status"];
const getExportColumns = (fields) => {
  const requested = fields ? String(fields).split(",").map((field) => field.trim()).filter(Boolean) : defaultExportFields;
  const selected = requested.map((field) => exportColumns.find((column) => column.key === field)).filter(Boolean);
  return selected.length ? selected : exportColumns.filter((column) => defaultExportFields.includes(column.key));
};

const populateInterview = (query) => query
  .populate("student", "name email")
  .populate({ path: "job", select: "title location", populate: { path: "company", select: "name locations" } })
  .populate("company", "name locations")
  .populate("scheduledBy", "name email")
  .populate("updatedBy", "name email");

// month is "YYYY-MM"; falls back to an explicit from/to range when provided.
const buildDateRange = (query) => {
  if (query.from || query.to) {
    const range = {};
    if (query.from) range.$gte = new Date(query.from);
    if (query.to) range.$lte = new Date(query.to);
    return range;
  }
  if (!query.month) return null;
  const [year, month] = String(query.month).split("-").map(Number);
  if (!year || !month) return null;
  return { $gte: new Date(year, month - 1, 1, 0, 0, 0, 0), $lt: new Date(year, month, 1, 0, 0, 0, 0) };
};

const buildQuery = (req) => {
  const query = {};
  const range = buildDateRange(req.query);
  if (range) query.scheduledAt = range;
  if (req.query.status) query.status = req.query.status;
  if (req.query.mode) query.mode = req.query.mode;
  if (req.query.company) query.company = req.query.company;
  if (req.query.application) query.application = req.query.application;
  return query;
};

const withStudentProfiles = async (interviews) => {
  const userIds = interviews.map((interview) => interview.student && interview.student._id).filter(Boolean);
  const profiles = await StudentProfile.find({ user: { $in: userIds } }).select("user name mobile academicDetails resume").lean();
  const profileByUser = new Map(profiles.map((profile) => [String(profile.user), profile]));

  return interviews.map((interview) => {
    const student = interview.student || {};
    const profile = profileByUser.get(String(student._id)) || {};
    return {
      ...interview,
      student: { ...profile, user: student, name: profile.name || student.name, email: student.email },
    };
  });
};

const matchesSearch = (interview, terms) => terms.every((term) => [
  interview.student && interview.student.name,
  interview.student && interview.student.email,
  interview.job && interview.job.title,
  interview.job && interview.job.company && interview.job.company.name,
  interview.round,
  interview.interviewerName,
].some((value) => String(value || "").toLowerCase().includes(term)));

// Company is a plain ref so it filters in mongo, but role is the populated job
// title and search spans populated fields, so both are applied after the fetch.
const loadInterviews = async (req) => {
  const interviews = await populateInterview(Interview.find(buildQuery(req)).sort({ scheduledAt: 1 })).lean();
  const enriched = await withStudentProfiles(interviews);
  const terms = parseSearchTerms(req.query.search).map((term) => term.toLowerCase());
  return enriched
    .filter((interview) => !req.query.role || String(interview.job && interview.job.title) === String(req.query.role))
    .filter((interview) => !terms.length || matchesSearch(interview, terms));
};

const fetchGetInterviews = async (req, res) => {
  if (!requireOps(req, res)) return;
  const data = await loadInterviews(req);
  return res.status(200).json({ success: true, total: data.length, data, statusCode: 200 });
};

const fetchGetInterviewFilterOptions = async (req, res) => {
  try {
    if (!requireOps(req, res)) return;
    const range = buildDateRange(req.query);
    const interviews = await populateInterview(Interview.find(range ? { scheduledAt: range } : {})).lean();
    const companies = interviews.map((interview) => interview.company || (interview.job && interview.job.company)).filter(Boolean);
    const data = {
      company: companies
        .map((company) => ({ label: company.name, value: String(company._id) }))
        .filter((option, index, options) => options.findIndex((item) => item.value === option.value) === index)
        .sort((a, b) => a.label.localeCompare(b.label)),
      role: compactOptions(interviews.map((interview) => interview.job && interview.job.title)),
      status: compactOptions(interviews.map((interview) => interview.status)),
      mode: compactOptions(interviews.map((interview) => interview.mode)),
    };
    return res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchExportInterviews = async (req, res) => {
  if (!requireOps(req, res)) return;
  const interviews = await loadInterviews(req);
  const columns = getExportColumns(req.query.fields);
  const rows = interviews.map((interview) => columns.reduce((row, column) => ({ ...row, [column.label]: column.value(interview, req.query.tz) ?? "" }), {}));
  const buffer = await exportExcel({ rows, sheetName: "Interviews" });
  res.setHeader("Content-Disposition", "attachment; filename=interviews.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
};

const fetchGetInterviewDetail = async (req, res) => {
  if (!requireOps(req, res)) return;
  const interview = await populateInterview(Interview.findById(req.params.id)).lean();
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found", statusCode: 404 });
  const data = (await withStudentProfiles([interview]))[0];
  return res.status(200).json({ success: true, data, statusCode: 200 });
};

const respondWithInterview = async (res, id, message, statusCode) => {
  const interview = await populateInterview(Interview.findById(id)).lean();
  const data = (await withStudentProfiles([interview]))[0];
  return res.status(statusCode).json({ success: true, message, data, statusCode });
};

const fetchCreateInterview = async (req, res) => {
  if (!requireOps(req, res)) return;
  const application = await Application.findById(req.body.application).populate("job", "company").lean();
  if (!application) return res.status(404).json({ success: false, message: "Application not found", statusCode: 404 });

  const { application: applicationId, note, ...details } = req.body;
  const interview = await Interview.create({
    ...details,
    application: applicationId,
    student: application.student,
    job: application.job && application.job._id,
    company: application.job && application.job.company,
    scheduledBy: req.user.mongoId,
    updatedBy: req.user.mongoId,
    notes: note ? [{ text: note, updatedBy: req.user.mongoId, date: new Date() }] : [],
  });

  return respondWithInterview(res, interview._id, "Interview scheduled", 201);
};

const applyInterviewChanges = async (req, res, body) => {
  const { note, ...changes } = body;
  const update = { $set: { ...changes, updatedBy: req.user.mongoId } };
  if (note) update.$push = { notes: { text: note, updatedBy: req.user.mongoId, date: new Date() } };
  const interview = await Interview.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found", statusCode: 404 });
  return respondWithInterview(res, interview._id, "Interview updated", 200);
};

const fetchUpdateInterview = async (req, res) => {
  if (!requireOps(req, res)) return;
  return applyInterviewChanges(req, res, req.body);
};

const fetchUpdateInterviewStatus = async (req, res) => {
  if (!requireOps(req, res)) return;
  return applyInterviewChanges(req, res, req.body);
};

const fetchDeleteInterview = async (req, res) => {
  if (!requireOps(req, res)) return;
  const interview = await Interview.findByIdAndDelete(req.params.id).lean();
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Interview deleted", statusCode: 200 });
};

module.exports = { fetchGetInterviews, fetchGetInterviewFilterOptions, fetchExportInterviews, fetchGetInterviewDetail, fetchCreateInterview, fetchUpdateInterview, fetchUpdateInterviewStatus, fetchDeleteInterview };
