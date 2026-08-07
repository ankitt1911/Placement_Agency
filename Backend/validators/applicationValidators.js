const Joi = require("joi");

const applicationStatuses = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected", "Withdrawn"];

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid(...applicationStatuses).required(),
  note: Joi.string().allow("", null),
});

const bulkUpdateApplicationStatusSchema = Joi.object({
  applications: Joi.array().items(Joi.string().hex().length(24)).min(1).max(500).unique().required(),
  status: Joi.string().valid(...applicationStatuses).required(),
  note: Joi.string().trim().max(1000).allow("", null),
});

module.exports = { updateApplicationStatusSchema, bulkUpdateApplicationStatusSchema, applicationStatuses };
