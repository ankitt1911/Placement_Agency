const Joi = require("joi");

const createIssueSchema = Joi.object({
  subject: Joi.string().trim().min(3).max(140).required(),
  description: Joi.string().trim().min(10).max(3000).required(),
  priority: Joi.string().valid("Low", "Medium", "High").required(),
});

const updateIssueStatusSchema = Joi.object({
  status: Joi.string().valid("Open", "Closed").required(),
});

module.exports = { createIssueSchema, updateIssueStatusSchema };
