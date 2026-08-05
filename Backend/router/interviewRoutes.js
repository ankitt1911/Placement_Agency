const express = require("express");
const interviewRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getMyInterviews } = require("../controllers/interviewController");

interviewRouter.use(jwtMiddleware);
interviewRouter.get("/my", getMyInterviews);

module.exports = interviewRouter;
