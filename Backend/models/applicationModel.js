const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpening", required: true },
  resumeUsed: String,
  status: {
    type: String,
    enum: ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected", "Withdrawn"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
  appliedFromOpenLink: { type: Boolean, default: false },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: [{ text: String, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, date: Date }],
}, { timestamps: true });

applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);
