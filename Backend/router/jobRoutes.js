const express = require("express");
const jobRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getPublicJobs, getOpenings, getOpeningFilterOptions, getOpeningDetail, applyJob, getOpenLinkOpening, applyViaOpenLink } = require("../controllers/jobController");

jobRouter.get("/public", getPublicJobs);
jobRouter.get("/open-link/:id", getOpenLinkOpening);
jobRouter.post("/open-link/:id/apply", applyViaOpenLink);
jobRouter.get("/openings", jwtMiddleware, getOpenings);
jobRouter.get("/openings/filter-options", jwtMiddleware, getOpeningFilterOptions);
jobRouter.get("/openings/:id", jwtMiddleware, getOpeningDetail);
jobRouter.post("/apply/:jobId", jwtMiddleware, applyJob);

module.exports = jobRouter;
