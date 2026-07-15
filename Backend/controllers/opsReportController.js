const opsReportService = require("../services/opsReportService");

const getReports = async (req, res) => opsReportService.fetchGetReports(req, res);
const getReportFilterOptions = async (req, res) => opsReportService.fetchGetReportFilterOptions(req, res);
const exportReports = async (req, res) => opsReportService.fetchExportReports(req, res);

module.exports = { getReports, getReportFilterOptions, exportReports };
