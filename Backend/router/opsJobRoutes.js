const express = require("express");
const opsJobRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getOpsJobs, getJobFilterOptions, createJob, getOpsJobDetail, updateJob, deleteJob, closeJob, reopenJob, updateOpenLink, closeOpenLink, duplicateJob, getJobApplicants, exportJobs } = require("../controllers/opsJobController");

opsJobRouter.get("/", jwtMiddleware, getOpsJobs);
opsJobRouter.post("/", jwtMiddleware, createJob);
opsJobRouter.get("/export", jwtMiddleware, exportJobs);
opsJobRouter.get("/filter-options", jwtMiddleware, getJobFilterOptions);
opsJobRouter.get("/:id", jwtMiddleware, getOpsJobDetail);
opsJobRouter.put("/:id", jwtMiddleware, updateJob);
opsJobRouter.delete("/:id", jwtMiddleware, deleteJob);
opsJobRouter.patch("/:id/close", jwtMiddleware, closeJob);
opsJobRouter.patch("/:id/reopen", jwtMiddleware, reopenJob);
opsJobRouter.patch("/:id/open-link", jwtMiddleware, updateOpenLink);
opsJobRouter.patch("/:id/open-link/close", jwtMiddleware, closeOpenLink);
opsJobRouter.post("/:id/duplicate", jwtMiddleware, duplicateJob);
opsJobRouter.get("/:id/applicants", jwtMiddleware, getJobApplicants);

module.exports = opsJobRouter;
