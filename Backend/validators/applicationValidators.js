const Joi = require("joi");

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid("Applied", "Under Review", "Shortlisted", "Selected", "Rejected", "Withdrawn").required(),
  note: Joi.string().allow("", null),
});

module.exports = { updateApplicationStatusSchema };
