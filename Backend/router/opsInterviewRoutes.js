const express = require("express");
const opsInterviewRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getInterviews, getInterviewFilterOptions, exportInterviews, getInterviewDetail, createInterview, updateInterview, updateInterviewStatus, deleteInterview } = require("../controllers/opsInterviewController");

opsInterviewRouter.use(jwtMiddleware);
opsInterviewRouter.get("/", getInterviews);
opsInterviewRouter.post("/", createInterview);
// Registered before "/:id" so these literal paths are not captured as an id.
opsInterviewRouter.get("/export", exportInterviews);
opsInterviewRouter.get("/filter-options", getInterviewFilterOptions);
opsInterviewRouter.get("/:id", getInterviewDetail);
opsInterviewRouter.put("/:id", updateInterview);
opsInterviewRouter.patch("/:id/status", updateInterviewStatus);
opsInterviewRouter.delete("/:id", deleteInterview);

module.exports = opsInterviewRouter;
