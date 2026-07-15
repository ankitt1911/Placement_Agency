const { updateProfileSchema } = require("../validators/profileValidators");
const { fetchGetMyProfile, fetchUpdateMyProfile, fetchUploadProfilePhoto, fetchUploadResume } = require("../services/profileService");

const getMyProfile = async (req, res) => fetchGetMyProfile(req, res);
const uploadProfilePhoto = async (req, res) => fetchUploadProfilePhoto(req, res);
const uploadResume = async (req, res) => fetchUploadResume(req, res);

const updateMyProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    await fetchUpdateMyProfile(req, res);
  } catch (error) {
    console.error("Error Update Profile:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

module.exports = { getMyProfile, updateMyProfile, uploadProfilePhoto, uploadResume };
