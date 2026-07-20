const Issue = require("../models/issueModel");
const { buildAndSearch } = require("../utils/searchUtils");

const isOps = (req) => req.user.role === "operations";
const requireOps = (req, res) => isOps(req) || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);

const populateIssue = (query) => query.populate("raisedBy", "name email role").populate("closedBy", "name email role");

const buildQuery = (req, scope) => {
  const query = {};
  if (scope === "my") query.raisedBy = req.user.mongoId;
  if (scope === "raised" && !isOps(req)) query.raisedBy = req.user.mongoId;
  if (req.query.status) query.status = req.query.status;
  const searchConditions = buildAndSearch(req.query.search, ["subject", "description"]);
  if (searchConditions.length) query.$and = searchConditions;
  return query;
};

const fetchCreateIssue = async (req, res) => {
  const issue = await Issue.create({
    subject: req.body.subject,
    description: req.body.description,
    priority: req.body.priority,
    raisedBy: req.user.mongoId,
  });
  const data = await populateIssue(Issue.findById(issue._id)).lean();
  return res.status(201).json({ success: true, message: "Issue raised", data, statusCode: 201 });
};

const fetchGetMyIssues = async (req, res) => {
  const data = await populateIssue(Issue.find(buildQuery(req, "my")).sort({ createdAt: -1 })).lean();
  return res.status(200).json({ success: true, data, statusCode: 200 });
};

const fetchGetRaisedIssues = async (req, res) => {
  if (!requireOps(req, res)) return;
  const data = await populateIssue(Issue.find(buildQuery(req, "raised")).sort({ createdAt: -1 })).lean();
  return res.status(200).json({ success: true, data, statusCode: 200 });
};

const fetchUpdateIssueStatus = async (req, res) => {
  if (!requireOps(req, res)) return;
  const update = {
    status: req.body.status,
    closedBy: req.body.status === "Closed" ? req.user.mongoId : undefined,
    closedAt: req.body.status === "Closed" ? new Date() : undefined,
  };
  if (req.body.status === "Open") {
    update.$unset = { closedBy: "", closedAt: "" };
    delete update.closedBy;
    delete update.closedAt;
  }
  const issue = await populateIssue(Issue.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })).lean();
  if (!issue) return res.status(404).json({ success: false, message: "Issue not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Issue status updated", data: issue, statusCode: 200 });
};

module.exports = { fetchCreateIssue, fetchGetMyIssues, fetchGetRaisedIssues, fetchUpdateIssueStatus };
