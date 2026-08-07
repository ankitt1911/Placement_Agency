const Joi = require("joi");

const interviewModes = ["Online", "In-Person", "Telephonic"];
const interviewStatuses = ["Scheduled", "Rescheduled", "Completed", "Cancelled", "No Show", "Selected", "Rejected"];

// Shared by the single and bulk create schemas so both stay in step.
const interviewDetailFields = {
  durationMinutes: Joi.number().integer().min(5).max(600).default(60),
  mode: Joi.string().valid(...interviewModes).default("Online"),
  round: Joi.string().trim().max(120).allow(""),
  meetingLink: Joi.string().trim().max(500).allow(""),
  location: Joi.string().trim().max(300).allow(""),
  interviewerName: Joi.string().trim().max(140).allow(""),
  interviewerEmail: Joi.string().trim().max(140).email({ tlds: false }).allow(""),
  note: Joi.string().trim().max(1000).allow(""),
};

const createInterviewSchema = Joi.object({
  application: Joi.string().hex().length(24).required(),
  scheduledAt: Joi.date().iso().required(),
  ...interviewDetailFields,
});

// "same" puts every candidate on scheduledAt; "stagger" walks forward by
// durationMinutes + gapMinutes for each candidate in the submitted order.
const bulkCreateInterviewSchema = Joi.object({
  applications: Joi.array().items(Joi.string().hex().length(24)).min(1).max(200).unique().required(),
  scheduledAt: Joi.date().iso().required(),
  slotMode: Joi.string().valid("same", "stagger").default("same"),
  gapMinutes: Joi.number().integer().min(0).max(600).default(0),
  ...interviewDetailFields,
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

module.exports = { createInterviewSchema, bulkCreateInterviewSchema, updateInterviewSchema, updateInterviewStatusSchema, interviewModes, interviewStatuses };
