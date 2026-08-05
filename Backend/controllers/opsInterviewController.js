const { createInterviewSchema, updateInterviewSchema, updateInterviewStatusSchema } = require("../validators/interviewValidators");
const opsInterviewService = require("../services/opsInterviewService");

const validated = (schema, handler) => async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  req.body = value;
  return handler(req, res);
};

const getInterviews = async (req, res) => opsInterviewService.fetchGetInterviews(req, res);
const getInterviewFilterOptions = async (req, res) => opsInterviewService.fetchGetInterviewFilterOptions(req, res);
const exportInterviews = async (req, res) => opsInterviewService.fetchExportInterviews(req, res);
const getInterviewDetail = async (req, res) => opsInterviewService.fetchGetInterviewDetail(req, res);
const deleteInterview = async (req, res) => opsInterviewService.fetchDeleteInterview(req, res);

const createInterview = validated(createInterviewSchema, opsInterviewService.fetchCreateInterview);
const updateInterview = validated(updateInterviewSchema, opsInterviewService.fetchUpdateInterview);
const updateInterviewStatus = validated(updateInterviewStatusSchema, opsInterviewService.fetchUpdateInterviewStatus);

module.exports = { getInterviews, getInterviewFilterOptions, exportInterviews, getInterviewDetail, createInterview, updateInterview, updateInterviewStatus, deleteInterview };
