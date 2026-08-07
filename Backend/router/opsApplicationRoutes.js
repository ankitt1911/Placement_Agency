const express = require("express");
const opsApplicationRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getApplications, getApplicationFilterOptions, getApplicationDetail, updateApplicationStatus, bulkUpdateApplicationStatus, exportApplications, downloadApplicationResume, generateApplicationResume } = require("../controllers/opsApplicationController");

opsApplicationRouter.get("/", jwtMiddleware, getApplications);
// Registered before "/:id" so these literal paths are not captured as an id.
opsApplicationRouter.patch("/bulk-status", jwtMiddleware, bulkUpdateApplicationStatus);
opsApplicationRouter.get("/export", jwtMiddleware, exportApplications);
opsApplicationRouter.get("/filter-options", jwtMiddleware, getApplicationFilterOptions);
opsApplicationRouter.get("/:id", jwtMiddleware, getApplicationDetail);
opsApplicationRouter.patch("/:id/status", jwtMiddleware, updateApplicationStatus);
opsApplicationRouter.get("/:id/resume", jwtMiddleware, downloadApplicationResume);
opsApplicationRouter.get("/:id/resume-pdf", jwtMiddleware, generateApplicationResume);

module.exports = opsApplicationRouter;
