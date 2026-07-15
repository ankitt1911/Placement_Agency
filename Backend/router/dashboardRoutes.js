const express = require("express");
const dashboardRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { studentDashboard, opsDashboard } = require("../controllers/dashboardController");

dashboardRouter.get("/student", jwtMiddleware, studentDashboard);
dashboardRouter.get("/", jwtMiddleware, opsDashboard);

module.exports = dashboardRouter;
