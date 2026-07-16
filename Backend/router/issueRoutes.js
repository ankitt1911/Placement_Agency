const express = require("express");
const issueRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { createIssue, getMyIssues, getRaisedIssues, updateIssueStatus } = require("../controllers/issueController");

issueRouter.use(jwtMiddleware);
issueRouter.post("/", createIssue);
issueRouter.get("/my", getMyIssues);
issueRouter.get("/raised", getRaisedIssues);
issueRouter.patch("/:id/status", updateIssueStatus);

module.exports = issueRouter;
