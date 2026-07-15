const { fetchPublicJobs, fetchGetOpenings, fetchGetOpeningFilterOptions, fetchGetOpeningDetail, fetchApplyJob, fetchGetOpenLinkOpening, fetchApplyViaOpenLink } = require("../services/jobService");

const getPublicJobs = async (req, res) => fetchPublicJobs(req, res);
const getOpenings = async (req, res) => fetchGetOpenings(req, res);
const getOpeningFilterOptions = async (req, res) => fetchGetOpeningFilterOptions(req, res);
const getOpeningDetail = async (req, res) => fetchGetOpeningDetail(req, res);
const applyJob = async (req, res) => fetchApplyJob(req, res);
const getOpenLinkOpening = async (req, res) => fetchGetOpenLinkOpening(req, res);
const applyViaOpenLink = async (req, res) => fetchApplyViaOpenLink(req, res);

module.exports = { getPublicJobs, getOpenings, getOpeningFilterOptions, getOpeningDetail, applyJob, getOpenLinkOpening, applyViaOpenLink };
