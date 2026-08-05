const { createBroadcastSchema, updateBroadcastSchema } = require("../validators/broadcastValidators");
const broadcastService = require("../services/broadcastService");

const validated = (schema, handler) => async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  req.body = value;
  return handler(req, res);
};

const getActiveBroadcasts = async (req, res) => broadcastService.fetchGetActiveBroadcasts(req, res);
const getBroadcasts = async (req, res) => broadcastService.fetchGetBroadcasts(req, res);
const toggleBroadcast = async (req, res) => broadcastService.fetchToggleBroadcast(req, res);
const deleteBroadcast = async (req, res) => broadcastService.fetchDeleteBroadcast(req, res);

const createBroadcast = validated(createBroadcastSchema, broadcastService.fetchCreateBroadcast);
const updateBroadcast = validated(updateBroadcastSchema, broadcastService.fetchUpdateBroadcast);

module.exports = { getActiveBroadcasts, getBroadcasts, createBroadcast, updateBroadcast, toggleBroadcast, deleteBroadcast };
