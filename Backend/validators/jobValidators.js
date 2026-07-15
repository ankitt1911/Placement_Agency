const Joi = require("joi");

const jobShape = {
  company: Joi.string(),
  title: Joi.string().trim(),
  description: Joi.string().allow("", null),
  location: Joi.array().items(Joi.string()),
  skills: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string()),
  experience: Joi.number(),
  salary: Joi.object({ min: Joi.number(), max: Joi.number() }),
  jobType: Joi.string().valid("Full-time", "Internship", "Part-time", "Contract"),
  category: Joi.string().valid("IT", "Non-IT"),
  vacancies: Joi.number().integer().min(1),
  eligibility: Joi.object({
    minCGPA: Joi.number(),
    activeBacklogs: Joi.number().integer().min(0),
    branches: Joi.array().items(Joi.string()),
    passingYear: Joi.array().items(Joi.number()),
  }),
  status: Joi.string().valid("Open", "Closed", "Draft"),
  applicationDeadline: Joi.date(),
  openLink: Joi.object({
    isActive: Joi.boolean(),
    expiresAt: Joi.date().allow(null),
  }),
};

const createJobSchema = Joi.object({ ...jobShape, company: jobShape.company.required(), title: jobShape.title.required() });
const updateJobSchema = Joi.object(jobShape).min(1);

module.exports = { createJobSchema, updateJobSchema };
