const mongoose = require("mongoose");

const educationDetailSchema = new mongoose.Schema({
  percentage: Number,
  year: Number,
  board: String,
  college: String,
  university: String,
  branch: String,
  cgpa: Number,
  passingYear: Number,
}, { _id: false });

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true, trim: true },
  dob: Date,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  mobile: String,
  address: String,
  profilePhoto: String,
  education: {
    tenth: educationDetailSchema,
    twelfth: educationDetailSchema,
    diploma: educationDetailSchema,
    graduation: educationDetailSchema,
    postGraduation: educationDetailSchema,
  },
  academicDetails: {
    college: String,
    university: String,
    branch: String,
    cgpa: Number,
    percentage: Number,
    passingYear: Number,
    placementEligibility: Boolean,
    activeBacklogs: Number,
    totalBacklogs: Number,
  },
  technicalSkills: [String],
  softSkills: [String],
  languages: [{ language: String, proficiency: String }],
  projects: [{ title: String, description: String, technologies: [String], link: String }],
  internships: [{ company: String, role: String, duration: String, description: String }],
  totalExperience: Number,
  achievements: [String],
  certifications: [{ name: String, issuer: String, date: Date, link: String }],
  resume: String,
  socialLinks: { github: String, linkedin: String, portfolio: String },
  preferredLocation: [String],
  expectedSalary: Number,
  currentStatus: { type: String, enum: ["Available", "Placed", "Not Looking"], default: "Available" },
  subscriptionStatus: { type: String, default: "free" },
  heardAbout: {
    source: { type: String, enum: ["Refer", "Social Media", "Other", ""], default: "" },
    referredBy: String,
    referrerContact: String,
    details: String,
  },
}, { timestamps: true });

studentProfileSchema.index({ "academicDetails.cgpa": 1, "academicDetails.branch": 1 });
studentProfileSchema.index({ technicalSkills: 1 });
studentProfileSchema.index({ "academicDetails.passingYear": 1 });
studentProfileSchema.index({ "academicDetails.activeBacklogs": 1 });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
