const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const StudentProfile = require("../models/studentProfileModel");
const Application = require("../models/applicationModel");
const { sendSignupOTPEmail, sendPasswordResetOTPEmail } = require("../mailer/authMailer");

const SIGNUP_OTP_VALID_MINUTES = 5;
const SIGNUP_OTP_VALID_MS = SIGNUP_OTP_VALID_MINUTES * 60 * 1000;

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const getOtpExpiry = () => new Date(Date.now() + SIGNUP_OTP_VALID_MS);

const attachSignupOtp = async (user) => {
  const otp = generateOtp();
  const expiresAt = getOtpExpiry();
  user.signupOtpHash = await bcrypt.hash(otp, 10);
  user.signupOtpExpiresAt = expiresAt;
  user.signupOtpIssuedAt = new Date();
  await user.save();

  const emailSent = await sendSignupOTPEmail({
    to: user.email,
    name: user.name,
    otp,
    validMinutes: SIGNUP_OTP_VALID_MINUTES,
  });

  if (!emailSent) {
    user.signupOtpHash = undefined;
    user.signupOtpExpiresAt = undefined;
    user.signupOtpIssuedAt = undefined;
    await user.save();
    return null;
  }

  return expiresAt;
};

const attachPasswordResetOtp = async (user) => {
  const otp = generateOtp();
  const expiresAt = getOtpExpiry();
  user.passwordResetOtpHash = await bcrypt.hash(otp, 10);
  user.passwordResetOtpExpiresAt = expiresAt;
  user.passwordResetOtpVerifiedAt = undefined;
  await user.save();

  const emailSent = await sendPasswordResetOTPEmail({
    to: user.email,
    name: user.name,
    otp,
    validMinutes: SIGNUP_OTP_VALID_MINUTES,
  });

  if (!emailSent) {
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    user.passwordResetOtpVerifiedAt = undefined;
    await user.save();
    return null;
  }

  return expiresAt;
};

const pendingOtpResponse = (res, statusCode, message, user, expiresAt, syncedApplications = 0) => res.status(statusCode).json({
  success: true,
  message,
  data: {
    email: user.email,
    expiresAt,
    validForSeconds: SIGNUP_OTP_VALID_MS / 1000,
    syncedApplications,
  },
  statusCode,
});

// An open link applicant already has a User + StudentProfile created for them, so signing up with
// that same email claims the existing account instead of being rejected as a duplicate. Keeping the
// same user document is what auto syncs their earlier applications, profile and resume.
const claimOpenLinkAccount = async (req, res, user, password) => {
  if (!user.isActive) return res.status(403).json({ success: false, message: "User account is inactive", statusCode: 403 });

  const profile = await StudentProfile.findOneAndUpdate(
    { user: user._id },
    { $setOnInsert: { user: user._id, name: req.body.name } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  // Only fill the blanks: the open link form already captured richer details than registration asks for.
  if (!profile.name) profile.name = req.body.name;
  if (!profile.mobile && req.body.mobile) profile.mobile = req.body.mobile;
  await profile.save();

  user.password = password;
  user.isClaimed = false;
  user.name = user.name || req.body.name;
  user.profile = user.profile || profile._id;
  user.isEmailVerified = false;
  await user.save();

  const syncedApplications = await Application.countDocuments({ student: user._id });
  const expiresAt = await attachSignupOtp(user);
  if (!expiresAt) return res.status(500).json({ success: false, message: "Unable to send verification OTP", statusCode: 500 });
  return pendingOtpResponse(res, 200, "Verification OTP sent to your email", user, expiresAt, syncedApplications);
};

const fetchRegister = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 10);
    const exists = await User.findOne({ email }).select("+signupOtpHash +signupOtpExpiresAt +signupOtpIssuedAt");
    if (exists && exists.role === "student" && !exists.isEmailVerified) {
      exists.name = req.body.name;
      exists.password = password;
      const profile = await StudentProfile.findOneAndUpdate(
        { user: exists._id },
        { $set: { name: req.body.name, mobile: req.body.mobile || "" } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      exists.profile = profile._id;
      const expiresAt = await attachSignupOtp(exists);
      if (!expiresAt) return res.status(500).json({ success: false, message: "Unable to send verification OTP", statusCode: 500 });
      return pendingOtpResponse(res, 200, "Verification OTP sent to your email", exists, expiresAt);
    }
    if (exists && (exists.isClaimed !== false || exists.role !== "student")) {
      return res.status(422).json({ success: false, message: "Email already registered", statusCode: 422 });
    }
    if (exists) return claimOpenLinkAccount(req, res, exists, password);

    const user = await User.create({ name: req.body.name, email, password, role: "student", isActive: false, isEmailVerified: false });
    const profile = await StudentProfile.create({ user: user._id, name: req.body.name, mobile: req.body.mobile });
    user.profile = profile._id;
    await user.save();

    const expiresAt = await attachSignupOtp(user);
    if (!expiresAt) return res.status(500).json({ success: false, message: "Unable to send verification OTP", statusCode: 500 });
    return pendingOtpResponse(res, 201, "Verification OTP sent to your email", user, expiresAt, 0);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchVerifySignupOtp = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email }).select("+password +signupOtpHash +signupOtpExpiresAt +signupOtpIssuedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (user.isEmailVerified) return res.status(422).json({ success: false, message: "Email already verified", statusCode: 422 });
    if (!user.signupOtpHash || !user.signupOtpExpiresAt) return res.status(422).json({ success: false, message: "Please request a new OTP", statusCode: 422 });
    if (user.signupOtpExpiresAt.getTime() <= Date.now()) return res.status(422).json({ success: false, message: "OTP has expired. Please request a new OTP", statusCode: 422 });

    const isMatch = await bcrypt.compare(req.body.otp, user.signupOtpHash);
    if (!isMatch) return res.status(422).json({ success: false, message: "Invalid OTP", statusCode: 422 });

    user.isEmailVerified = true;
    user.isActive = true;
    user.isClaimed = true;
    user.signupOtpHash = undefined;
    user.signupOtpExpiresAt = undefined;
    user.signupOtpIssuedAt = undefined;
    await user.save();

    const syncedApplications = await Application.countDocuments({ student: user._id });
    return res.status(200).json({ success: true, message: "Email verified successfully. Please login.", data: { ...publicUser(user), syncedApplications }, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchResendSignupOtp = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email }).select("+signupOtpHash +signupOtpExpiresAt +signupOtpIssuedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (user.isEmailVerified) return res.status(422).json({ success: false, message: "Email already verified", statusCode: 422 });

    const expiresAt = await attachSignupOtp(user);
    if (!expiresAt) return res.status(500).json({ success: false, message: "Unable to send verification OTP", statusCode: 500 });
    return pendingOtpResponse(res, 200, "New verification OTP sent to your email", user, expiresAt);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchForgotPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email }).select("+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpVerifiedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (!user.isActive) return res.status(403).json({ success: false, message: "User account is inactive", statusCode: 403 });
    if (!user.isEmailVerified) return res.status(403).json({ success: false, message: "Please verify your email before resetting password", statusCode: 403 });

    const expiresAt = await attachPasswordResetOtp(user);
    if (!expiresAt) return res.status(500).json({ success: false, message: "Unable to send password reset OTP", statusCode: 500 });
    return pendingOtpResponse(res, 200, "Password reset OTP sent to your email", user, expiresAt);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchVerifyForgotPasswordOtp = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email }).select("+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpVerifiedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) return res.status(422).json({ success: false, message: "Please request a new OTP", statusCode: 422 });
    if (user.passwordResetOtpExpiresAt.getTime() <= Date.now()) return res.status(422).json({ success: false, message: "OTP has expired. Please request a new OTP", statusCode: 422 });

    const isMatch = await bcrypt.compare(req.body.otp, user.passwordResetOtpHash);
    if (!isMatch) return res.status(422).json({ success: false, message: "Invalid OTP", statusCode: 422 });

    user.passwordResetOtpVerifiedAt = new Date();
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully", data: { email: user.email, expiresAt: user.passwordResetOtpExpiresAt }, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchResetPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email }).select("+password +passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpVerifiedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (!user.passwordResetOtpVerifiedAt || !user.passwordResetOtpExpiresAt) return res.status(422).json({ success: false, message: "Please verify OTP before changing password", statusCode: 422 });
    if (user.passwordResetOtpExpiresAt.getTime() <= Date.now()) return res.status(422).json({ success: false, message: "OTP has expired. Please request a new OTP", statusCode: 422 });

    const isSame = await bcrypt.compare(req.body.newPassword, user.password);
    if (isSame) return res.status(422).json({ success: false, message: "New password must be different from the current password", statusCode: 422 });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    user.passwordResetOtpVerifiedAt = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. Please login.", statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    if (!user.isEmailVerified) return res.status(403).json({ success: false, message: "Please verify your email before logging in", statusCode: 403 });
    if (!user.isActive) return res.status(403).json({ success: false, message: "User account is inactive", statusCode: 403 });
    if (user.isClaimed === false) return res.status(403).json({ success: false, message: "You applied through an open link but have not set a password yet. Please register with this email to activate your account", statusCode: 403 });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials", statusCode: 401 });

    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ mongoId: user._id, email: user.email, role: user.role }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

    return res.status(200).json({ success: true, message: "Login successful", token, user: publicUser(user), statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchChangePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.mongoId).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    // Open link accounts have a placeholder password they never set, so they must register to claim it first.
    if (user.isClaimed === false) return res.status(403).json({ success: false, message: "Please activate your account by registering with this email before changing the password", statusCode: 403 });

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    // 422 and not 401: the frontend interceptor treats 401 as an expired session and logs the user out.
    if (!isMatch) return res.status(422).json({ success: false, message: "Current password is incorrect", statusCode: 422 });

    const isSame = await bcrypt.compare(req.body.newPassword, user.password);
    if (isSame) return res.status(422).json({ success: false, message: "New password must be different from the current password", statusCode: 422 });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully", statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchRefreshToken = async (req, res) => {
  return res.status(501).json({ success: false, message: "Refresh token storage is not implemented yet", statusCode: 501 });
};

const fetchLogout = async (req, res) => {
  return res.status(200).json({ success: true, message: "Logged out successfully", statusCode: 200 });
};

module.exports = {
  fetchRegister,
  fetchVerifySignupOtp,
  fetchResendSignupOtp,
  fetchForgotPassword,
  fetchVerifyForgotPasswordOtp,
  fetchResetPassword,
  fetchLogin,
  fetchChangePassword,
  fetchRefreshToken,
  fetchLogout,
};
