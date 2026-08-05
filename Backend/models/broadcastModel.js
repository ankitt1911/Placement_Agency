const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  category: {
    type: String,
    enum: ["Announcement", "Drive", "Deadline", "Event", "Achievement", "Alert"],
    default: "Announcement",
  },
  priority: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" },
  linkUrl: { type: String, trim: true, maxlength: 500 },
  linkLabel: { type: String, trim: true, maxlength: 60 },
  startsAt: { type: Date, default: Date.now, index: true },
  endsAt: { type: Date, index: true },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

broadcastSchema.index({ isActive: 1, startsAt: -1 });

module.exports = mongoose.model("Broadcast", broadcastSchema);
