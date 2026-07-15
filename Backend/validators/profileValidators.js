const Joi = require("joi");

const looseObject = Joi.object().unknown(true);

const updateProfileSchema = Joi.object({
  name: Joi.string().trim(),
  dob: Joi.date(),
  gender: Joi.string().valid("Male", "Female", "Other"),
  mobile: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  education: looseObject,
  academicDetails: looseObject,
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
  languages: Joi.array().items(looseObject),
  projects: Joi.array().items(looseObject),
  internships: Joi.array().items(looseObject),
  totalExperience: Joi.number().min(0),
  achievements: Joi.array().items(Joi.string()),
  certifications: Joi.array().items(looseObject),
  socialLinks: looseObject,
  preferredLocation: Joi.array().items(Joi.string()),
  expectedSalary: Joi.number(),
  currentStatus: Joi.string().valid("Available", "Placed", "Not Looking"),
  subscriptionStatus: Joi.string(),
  heardAbout: Joi.object({
    source: Joi.string().valid("Refer", "Social Media", "Other", "").allow("", null),
    referredBy: Joi.string().allow("", null),
    referrerContact: Joi.string().allow("", null),
    details: Joi.string().allow("", null),
  }),
}).min(1);

module.exports = { updateProfileSchema };
