const express = require("express");
const opsReportRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getReports, getReportFilterOptions, exportReports } = require("../controllers/opsReportController");

opsReportRouter.get("/export", jwtMiddleware, exportReports);
opsReportRouter.get("/filter-options", jwtMiddleware, getReportFilterOptions);
opsReportRouter.get("/", jwtMiddleware, getReports);

module.exports = opsReportRouter;
