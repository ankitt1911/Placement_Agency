const express = require("express");
const profileRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const upload = require("../uploads/upload");
const { getMyProfile, updateMyProfile, uploadProfilePhoto, uploadResume } = require("../controllers/profileController");

profileRouter.get("/me", jwtMiddleware, getMyProfile);
profileRouter.put("/me", jwtMiddleware, updateMyProfile);
profileRouter.patch("/photo", jwtMiddleware, upload.single("photo"), uploadProfilePhoto);
profileRouter.patch("/resume", jwtMiddleware, upload.single("resume"), uploadResume);

module.exports = profileRouter;
