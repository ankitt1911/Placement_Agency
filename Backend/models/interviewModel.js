const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpening", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 60, min: 5, max: 600 },
  mode: { type: String, enum: ["Online", "In-Person", "Telephonic"], default: "Online" },
  round: { type: String, trim: true, maxlength: 120 },
  meetingLink: { type: String, trim: true, maxlength: 500 },
  location: { type: String, trim: true, maxlength: 300 },
  interviewerName: { type: String, trim: true, maxlength: 140 },
  interviewerEmail: { type: String, trim: true, lowercase: true, maxlength: 140 },
  status: {
    type: String,
    enum: ["Scheduled", "Rescheduled", "Completed", "Cancelled", "No Show", "Selected", "Rejected"],
    default: "Scheduled",
    index: true,
  },
  feedback: { type: String, trim: true, maxlength: 3000 },
  notes: [{ text: String, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, date: Date }],
  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

interviewSchema.index({ scheduledAt: 1, status: 1 });
interviewSchema.index({ application: 1, scheduledAt: -1 });

module.exports = mongoose.model("Interview", interviewSchema);
