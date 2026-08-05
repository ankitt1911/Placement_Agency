const Joi = require("joi");

const broadcastCategories = ["Announcement", "Drive", "Deadline", "Event", "Achievement", "Alert"];
const broadcastPriorities = ["Low", "Normal", "High"];

const broadcastFields = {
  title: Joi.string().trim().min(3).max(140),
  message: Joi.string().trim().min(3).max(2000),
  category: Joi.string().valid(...broadcastCategories),
  priority: Joi.string().valid(...broadcastPriorities),
  linkUrl: Joi.string().trim().max(500).allow(""),
  linkLabel: Joi.string().trim().max(60).allow(""),
  startsAt: Joi.date().iso().allow(null, ""),
  endsAt: Joi.date().iso().allow(null, ""),
  isActive: Joi.boolean(),
};

const createBroadcastSchema = Joi.object({
  ...broadcastFields,
  title: broadcastFields.title.required(),
  message: broadcastFields.message.required(),
});

const updateBroadcastSchema = Joi.object(broadcastFields).min(1);

module.exports = { createBroadcastSchema, updateBroadcastSchema, broadcastCategories, broadcastPriorities };
