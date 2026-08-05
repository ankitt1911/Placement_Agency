const Broadcast = require("../models/broadcastModel");

const requireOps = (req, res) => req.user.role === "operations" || (res.status(403).json({ success: false, message: "Access denied", statusCode: 403 }), false);

const populateBroadcast = (query) => query.populate("createdBy", "name email").populate("updatedBy", "name email");

// Ongoing means switched on and inside its scheduled window. An empty endsAt
// runs until it is switched off.
const ongoingQuery = () => {
  const now = new Date();
  return {
    isActive: true,
    $and: [
      { $or: [{ startsAt: { $lte: now } }, { startsAt: null }] },
      { $or: [{ endsAt: { $gte: now } }, { endsAt: null }, { endsAt: { $exists: false } }] },
    ],
  };
};

// Blank strings from the form mean "clear this field", not "set to empty".
const sanitize = (body) => Object.entries(body).reduce((result, [key, value]) => {
  if (["startsAt", "endsAt"].includes(key) && (value === "" || value === null)) return { ...result, [key]: null };
  return { ...result, [key]: value };
}, {});

const fetchGetActiveBroadcasts = async (req, res) => {
  const data = await Broadcast.find(ongoingQuery()).sort({ priority: -1, startsAt: -1 }).lean();
  return res.status(200).json({ success: true, total: data.length, data, statusCode: 200 });
};

const fetchGetBroadcasts = async (req, res) => {
  if (!requireOps(req, res)) return;
  const query = {};
  if (req.query.isActive !== undefined) query.isActive = String(req.query.isActive) === "true";
  const data = await populateBroadcast(Broadcast.find(query).sort({ createdAt: -1 })).lean();
  return res.status(200).json({ success: true, total: data.length, data, statusCode: 200 });
};

const fetchCreateBroadcast = async (req, res) => {
  if (!requireOps(req, res)) return;
  const broadcast = await Broadcast.create({ ...sanitize(req.body), createdBy: req.user.mongoId, updatedBy: req.user.mongoId });
  const data = await populateBroadcast(Broadcast.findById(broadcast._id)).lean();
  return res.status(201).json({ success: true, message: "Broadcast published", data, statusCode: 201 });
};

const fetchUpdateBroadcast = async (req, res) => {
  if (!requireOps(req, res)) return;
  const update = { ...sanitize(req.body), updatedBy: req.user.mongoId };
  const data = await populateBroadcast(Broadcast.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })).lean();
  if (!data) return res.status(404).json({ success: false, message: "Broadcast not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Broadcast updated", data, statusCode: 200 });
};

const fetchToggleBroadcast = async (req, res) => {
  if (!requireOps(req, res)) return;
  const broadcast = await Broadcast.findById(req.params.id);
  if (!broadcast) return res.status(404).json({ success: false, message: "Broadcast not found", statusCode: 404 });
  broadcast.isActive = !broadcast.isActive;
  broadcast.updatedBy = req.user.mongoId;
  await broadcast.save();
  const data = await populateBroadcast(Broadcast.findById(broadcast._id)).lean();
  return res.status(200).json({ success: true, message: data.isActive ? "Broadcast resumed" : "Broadcast stopped", data, statusCode: 200 });
};

const fetchDeleteBroadcast = async (req, res) => {
  if (!requireOps(req, res)) return;
  const broadcast = await Broadcast.findByIdAndDelete(req.params.id).lean();
  if (!broadcast) return res.status(404).json({ success: false, message: "Broadcast not found", statusCode: 404 });
  return res.status(200).json({ success: true, message: "Broadcast deleted", statusCode: 200 });
};

module.exports = { fetchGetActiveBroadcasts, fetchGetBroadcasts, fetchCreateBroadcast, fetchUpdateBroadcast, fetchToggleBroadcast, fetchDeleteBroadcast };
