const User = require("../models/userModel");
const StudentProfile = require("../models/studentProfileModel");
const { toPublicFilePath } = require("../utils/fileResponse");

const requireStudent = (req, res) => {
  if (req.user.role !== "student") {
    res.status(403).json({ success: false, message: "Access denied", statusCode: 403 });
    return false;
  }
  return true;
};

const fetchGetMyProfile = async (req, res) => {
  try {
    if (!requireStudent(req, res)) return;
    const profile = await StudentProfile.findOne({ user: req.user.mongoId }).populate("user", "name email role isActive").lean();
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found", statusCode: 404 });
    return res.status(200).json({ success: true, data: profile, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchUpdateMyProfile = async (req, res) => {
  try {
    if (!requireStudent(req, res)) return;
    const update = { ...req.body };
    delete update.user;
    const profile = await StudentProfile.findOneAndUpdate({ user: req.user.mongoId }, update, { new: true, runValidators: true });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found", statusCode: 404 });
    if (update.name) await User.findByIdAndUpdate(req.user.mongoId, { name: update.name });
    return res.status(200).json({ success: true, message: "Profile updated successfully", data: profile, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchUploadProfilePhoto = async (req, res) => {
  try {
    if (!requireStudent(req, res)) return;
    if (req.file && !req.file.mimetype.startsWith("image/")) return res.status(422).json({ success: false, message: "Image file is required", statusCode: 422 });
    const profile = req.file
      ? await StudentProfile.findOneAndUpdate({ user: req.user.mongoId }, { profilePhoto: toPublicFilePath(req.file) }, { new: true })
      : await StudentProfile.findOne({ user: req.user.mongoId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found", statusCode: 404 });
    return res.status(200).json({ success: true, message: req.file ? "Profile photo uploaded" : "No profile photo provided", data: profile, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const fetchUploadResume = async (req, res) => {
  try {
    if (!requireStudent(req, res)) return;
    if (req.file && req.file.mimetype.startsWith("image/")) return res.status(422).json({ success: false, message: "Resume file is required", statusCode: 422 });
    const profile = req.file
      ? await StudentProfile.findOneAndUpdate({ user: req.user.mongoId }, { resume: toPublicFilePath(req.file) }, { new: true })
      : await StudentProfile.findOne({ user: req.user.mongoId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found", statusCode: 404 });
    return res.status(200).json({ success: true, message: req.file ? "Resume uploaded" : "No resume provided", data: profile, statusCode: 200 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

module.exports = { fetchGetMyProfile, fetchUpdateMyProfile, fetchUploadProfilePhoto, fetchUploadResume };
