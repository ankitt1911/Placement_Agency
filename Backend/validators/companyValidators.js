const Joi = require("joi");

const companyShape = {
  name: Joi.string().trim(),
  industry: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  locations: Joi.array().items(Joi.string()),
  website: Joi.string().allow("", null),
  logo: Joi.string().allow("", null),
  description: Joi.string().allow("", null),
  documents: Joi.array().items(Joi.string()),
  contactPerson: Joi.object({
    name: Joi.string().allow("", null),
    email: Joi.string().email().allow("", null),
    phone: Joi.string().allow("", null),
  }),
};

const createCompanySchema = Joi.object({ ...companyShape, name: companyShape.name.required() });
const updateCompanySchema = Joi.object(companyShape).min(1);

module.exports = { createCompanySchema, updateCompanySchema };
