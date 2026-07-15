const { createJobSchema, updateJobSchema } = require("../validators/jobValidators");
const opsJobService = require("../services/opsJobService");

const getOpsJobs = async (req, res) => opsJobService.fetchGetOpsJobs(req, res);
const getJobFilterOptions = async (req, res) => opsJobService.fetchGetJobFilterOptions(req, res);
const getOpsJobDetail = async (req, res) => opsJobService.fetchGetOpsJobDetail(req, res);
const deleteJob = async (req, res) => opsJobService.fetchDeleteJob(req, res);
const closeJob = async (req, res) => opsJobService.fetchCloseJob(req, res);
const reopenJob = async (req, res) => opsJobService.fetchReopenJob(req, res);
const updateOpenLink = async (req, res) => opsJobService.fetchUpdateOpenLink(req, res);
const closeOpenLink = async (req, res) => opsJobService.fetchCloseOpenLink(req, res);
const duplicateJob = async (req, res) => opsJobService.fetchDuplicateJob(req, res);
const getJobApplicants = async (req, res) => opsJobService.fetchGetJobApplicants(req, res);
const exportJobs = async (req, res) => opsJobService.fetchExportJobs(req, res);

const createJob = async (req, res) => {
  const { error } = createJobSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return opsJobService.fetchCreateJob(req, res);
};

const updateJob = async (req, res) => {
  const { error } = updateJobSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return opsJobService.fetchUpdateJob(req, res);
};

module.exports = { getOpsJobs, getJobFilterOptions, createJob, getOpsJobDetail, updateJob, deleteJob, closeJob, reopenJob, updateOpenLink, closeOpenLink, duplicateJob, getJobApplicants, exportJobs };
