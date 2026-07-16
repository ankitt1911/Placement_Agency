const { createIssueSchema, updateIssueStatusSchema } = require("../validators/issueValidators");
const issueService = require("../services/issueService");

const createIssue = async (req, res) => {
  const { error } = createIssueSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return issueService.fetchCreateIssue(req, res);
};

const getMyIssues = async (req, res) => issueService.fetchGetMyIssues(req, res);
const getRaisedIssues = async (req, res) => issueService.fetchGetRaisedIssues(req, res);

const updateIssueStatus = async (req, res) => {
  const { error } = updateIssueStatusSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return issueService.fetchUpdateIssueStatus(req, res);
};

module.exports = { createIssue, getMyIssues, getRaisedIssues, updateIssueStatus };
