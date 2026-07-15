const { fetchMyApplications, fetchMyApplicationFilterOptions, fetchMyApplicationDetail, fetchWithdrawApplication } = require("../services/applicationService");

const getMyApplications = async (req, res) => fetchMyApplications(req, res);
const getMyApplicationFilterOptions = async (req, res) => fetchMyApplicationFilterOptions(req, res);
const getMyApplicationDetail = async (req, res) => fetchMyApplicationDetail(req, res);
const withdrawApplication = async (req, res) => fetchWithdrawApplication(req, res);

module.exports = { getMyApplications, getMyApplicationFilterOptions, getMyApplicationDetail, withdrawApplication };
