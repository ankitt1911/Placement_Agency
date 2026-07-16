const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true, default: "Medium" },
  status: { type: String, enum: ["Open", "Closed"], required: true, default: "Open", index: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  closedAt: { type: Date },
}, { timestamps: true });

issueSchema.index({ raisedBy: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Issue", issueSchema);
