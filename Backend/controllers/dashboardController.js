const { fetchStudentDashboard, fetchOpsDashboard } = require("../services/dashboardService");

const studentDashboard = async (req, res) => fetchStudentDashboard(req, res);
const opsDashboard = async (req, res) => fetchOpsDashboard(req, res);

module.exports = { studentDashboard, opsDashboard };
