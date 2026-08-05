const Interview = require("../models/interviewModel");

const requireStudent = (req, res) => req.user.role === "student" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);

// Panel feedback and the internal note trail stay operations-only.
const studentFields = "application job company scheduledAt durationMinutes mode round meetingLink location interviewerName status createdAt updatedAt";

const fetchGetMyInterviews = async (req, res) => {
  if (!requireStudent(req, res)) return;
  const query = { student: req.user.mongoId };
  if (req.query.status) query.status = req.query.status;
  const data = await Interview.find(query)
    .select(studentFields)
    .populate({ path: "job", select: "title location", populate: { path: "company", select: "name locations" } })
    .populate("company", "name locations")
    .sort({ scheduledAt: -1 })
    .lean();
  return res.status(200).json({ success: true, total: data.length, data, statusCode: 200 });
};

module.exports = { fetchGetMyInterviews };
