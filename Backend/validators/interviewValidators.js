const Joi = require("joi");

const interviewModes = ["Online", "In-Person", "Telephonic"];
const interviewStatuses = ["Scheduled", "Rescheduled", "Completed", "Cancelled", "No Show", "Selected", "Rejected"];

const createInterviewSchema = Joi.object({
  application: Joi.string().hex().length(24).required(),
  scheduledAt: Joi.date().iso().required(),
  durationMinutes: Joi.number().integer().min(5).max(600).default(60),
  mode: Joi.string().valid(...interviewModes).default("Online"),
  round: Joi.string().trim().max(120).allow(""),
  meetingLink: Joi.string().trim().max(500).allow(""),
  location: Joi.string().trim().max(300).allow(""),
  interviewerName: Joi.string().trim().max(140).allow(""),
  interviewerEmail: Joi.string().trim().max(140).email({ tlds: false }).allow(""),
  note: Joi.string().trim().max(1000).allow(""),
});

const updateInterviewSchema = Joi.object({
  scheduledAt: Joi.date().iso(),
  durationMinutes: Joi.number().integer().min(5).max(600),
  mode: Joi.string().valid(...interviewModes),
  round: Joi.string().trim().max(120).allow(""),
  meetingLink: Joi.string().trim().max(500).allow(""),
  location: Joi.string().trim().max(300).allow(""),
  interviewerName: Joi.string().trim().max(140).allow(""),
  interviewerEmail: Joi.string().trim().max(140).email({ tlds: false }).allow(""),
  status: Joi.string().valid(...interviewStatuses),
  feedback: Joi.string().trim().max(3000).allow(""),
  note: Joi.string().trim().max(1000).allow(""),
}).min(1);

const updateInterviewStatusSchema = Joi.object({
  status: Joi.string().valid(...interviewStatuses).required(),
  feedback: Joi.string().trim().max(3000).allow(""),
  note: Joi.string().trim().max(1000).allow(""),
});

module.exports = { createInterviewSchema, updateInterviewSchema, updateInterviewStatusSchema, interviewModes, interviewStatuses };
