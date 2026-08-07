const { updateApplicationStatusSchema, bulkUpdateApplicationStatusSchema } = require("../validators/applicationValidators");
const opsApplicationService = require("../services/opsApplicationService");

const getApplications = async (req, res) => opsApplicationService.fetchGetApplications(req, res);
const getApplicationFilterOptions = async (req, res) => opsApplicationService.fetchGetApplicationFilterOptions(req, res);
const getApplicationDetail = async (req, res) => opsApplicationService.fetchGetApplicationDetail(req, res);
const exportApplications = async (req, res) => opsApplicationService.fetchExportApplications(req, res);
const downloadApplicationResume = async (req, res) => opsApplicationService.fetchDownloadApplicationResume(req, res);

const updateApplicationStatus = async (req, res) => {
  const { error } = updateApplicationStatusSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return opsApplicationService.fetchUpdateApplicationStatus(req, res);
};

const bulkUpdateApplicationStatus = async (req, res) => {
  const { error, value } = bulkUpdateApplicationStatusSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  req.body = value;
  return opsApplicationService.fetchBulkUpdateApplicationStatus(req, res);
};

module.exports = { getApplications, getApplicationFilterOptions, getApplicationDetail, updateApplicationStatus, bulkUpdateApplicationStatus, exportApplications, downloadApplicationResume };
