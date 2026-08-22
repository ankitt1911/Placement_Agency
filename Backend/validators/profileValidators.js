const Joi = require("joi");

const looseObject = Joi.object().unknown(true);

const updateProfileSchema = Joi.object({
  name: Joi.string().trim(),
  dob: Joi.date(),
  gender: Joi.string().valid("Male", "Female", "Other"),
  mobile: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  profilePhoto: Joi.string().uri().allow("", null),
  resume: Joi.string().uri().allow("", null),
  education: looseObject,
  academicDetails: looseObject,
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
  languages: Joi.array().items(looseObject),
  projects: Joi.array().items(looseObject),
  internships: Joi.array().items(looseObject),
  totalExperience: Joi.number().min(0),
  companyName: Joi.string().allow("", null),
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

const requiredEducation = Joi.object({
  tenth: Joi.object().min(1).required(),
  twelfth: Joi.object().min(1).required(),
  diploma: Joi.object(),
  graduation: Joi.object().min(1).required(),
  postGraduation: Joi.object(),
}).unknown(true).required();

const requiredAcademics = Joi.object({
  college: Joi.string().trim().required(),
  university: Joi.string().trim().required(),
  branch: Joi.string().trim().required(),
  passingYear: Joi.number().required(),
  cgpa: Joi.number().min(0).max(10).required(),
  percentage: Joi.number().min(0).max(100).required(),
  totalBacklogs: Joi.number().min(0).required(),
  activeBacklogs: Joi.number().min(0).required(),
}).unknown(true).required();

const completeProfileSchema = updateProfileSchema.keys({
  name: Joi.string().trim().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().trim().required(),
  education: requiredEducation,
  academicDetails: requiredAcademics,
  technicalSkills: Joi.array().items(Joi.string()).min(1).required(),
  languages: Joi.array().items(looseObject).min(1).required(),
});

module.exports = { updateProfileSchema, completeProfileSchema };
