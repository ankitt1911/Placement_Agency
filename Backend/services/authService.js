const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const StudentProfile = require("../models/studentProfileModel");
const Application = require("../models/applicationModel");

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });

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
  user.isClaimed = true;
  user.name = user.name || req.body.name;
  user.profile = user.profile || profile._id;
  await user.save();

  const syncedApplications = await Application.countDocuments({ student: user._id });
  return res.status(200).json({
    success: true,
    message: "Registration successful",
    data: { ...publicUser(user), syncedApplications },
    statusCode: 200,
  });
};

const fetchRegister = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 10);
    const exists = await User.findOne({ email });
    if (exists && (exists.isClaimed !== false || exists.role !== "student")) {
      return res.status(422).json({ success: false, message: "Email already registered", statusCode: 422 });
    }
    if (exists) return claimOpenLinkAccount(req, res, exists, password);

    const user = await User.create({ name: req.body.name, email, password, role: "student" });
    const profile = await StudentProfile.create({ user: user._id, name: req.body.name, mobile: req.body.mobile });
    user.profile = profile._id;
    await user.save();

    return res.status(201).json({ success: true, message: "Registration successful", data: { ...publicUser(user), syncedApplications: 0 }, statusCode: 201 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
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

const fetchRefreshToken = async (req, res) => {
  return res.status(501).json({ success: false, message: "Refresh token storage is not implemented yet", statusCode: 501 });
};

const fetchLogout = async (req, res) => {
  return res.status(200).json({ success: true, message: "Logged out successfully", statusCode: 200 });
};

module.exports = { fetchRegister, fetchLogin, fetchRefreshToken, fetchLogout };
