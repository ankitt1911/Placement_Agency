const express = require("express");
const opsApplicationRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getApplications, getApplicationFilterOptions, getApplicationDetail, updateApplicationStatus, exportApplications, downloadApplicationResume } = require("../controllers/opsApplicationController");

opsApplicationRouter.get("/", jwtMiddleware, getApplications);
opsApplicationRouter.get("/export", jwtMiddleware, exportApplications);
opsApplicationRouter.get("/filter-options", jwtMiddleware, getApplicationFilterOptions);
opsApplicationRouter.get("/:id", jwtMiddleware, getApplicationDetail);
opsApplicationRouter.patch("/:id/status", jwtMiddleware, updateApplicationStatus);
opsApplicationRouter.get("/:id/resume", jwtMiddleware, downloadApplicationResume);

module.exports = opsApplicationRouter;
