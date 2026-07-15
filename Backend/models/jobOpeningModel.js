const mongoose = require("mongoose");

const jobOpeningSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  location: [String],
  skills: [String],
  languages: [String],
  experience: Number,
  salary: { min: Number, max: Number },
  jobType: { type: String, enum: ["Full-time", "Internship", "Part-time", "Contract"] },
  category: { type: String, enum: ["IT", "Non-IT"], default: "IT" },
  vacancies: { type: Number, default: 1 },
  eligibility: {
    minCGPA: Number,
    activeBacklogs: Number,
    branches: [String],
    passingYear: [Number],
  },
  status: { type: String, enum: ["Open", "Closed", "Draft"], default: "Open" },
  openLink: {
    isActive: { type: Boolean, default: false },
    expiresAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicationDeadline: Date,
}, { timestamps: true });

jobOpeningSchema.index({ skills: 1, "salary.min": 1 });
jobOpeningSchema.index({ location: 1, "salary.min": 1 });
jobOpeningSchema.index({ category: 1, status: 1 });
jobOpeningSchema.index({ company: 1, status: 1 });
jobOpeningSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("JobOpening", jobOpeningSchema);
