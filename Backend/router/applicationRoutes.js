const express = require("express");
const applicationRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getMyApplications, getMyApplicationFilterOptions, getMyApplicationDetail, withdrawApplication } = require("../controllers/applicationController");

applicationRouter.get("/my", jwtMiddleware, getMyApplications);
applicationRouter.get("/my/filter-options", jwtMiddleware, getMyApplicationFilterOptions);
applicationRouter.get("/my/:id", jwtMiddleware, getMyApplicationDetail);
applicationRouter.post("/:id/withdraw", jwtMiddleware, withdrawApplication);

module.exports = applicationRouter;
