const interviewService = require("../services/interviewService");

const getMyInterviews = async (req, res) => interviewService.fetchGetMyInterviews(req, res);

module.exports = { getMyInterviews };
