const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["student", "operations"], required: true },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  signupOtpHash: { type: String, select: false },
  signupOtpExpiresAt: { type: Date, select: false },
  signupOtpIssuedAt: { type: Date, select: false },
  passwordResetOtpHash: { type: String, select: false },
  passwordResetOtpExpiresAt: { type: Date, select: false },
  passwordResetOtpVerifiedAt: { type: Date, select: false },
  lastLogin: { type: Date },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
  name: { type: String, trim: true },
  accountSource: { type: String, enum: ["self", "open-link"], default: "self" },
  isClaimed: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model("User", userSchema);
