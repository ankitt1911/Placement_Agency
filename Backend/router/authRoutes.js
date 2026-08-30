const express = require("express");
const authRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const {
  register,
  verifySignupOtp,
  resendSignupOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  login,
  changePassword,
  refreshToken,
  logout,
} = require("../controllers/authController");

authRouter.post("/register", register);
authRouter.post("/verify-signup-otp", verifySignupOtp);
authRouter.post("/resend-signup-otp", resendSignupOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/login", login);
authRouter.patch("/change-password", jwtMiddleware, changePassword);
authRouter.post("/refresh-token", jwtMiddleware, refreshToken);
authRouter.post("/logout", jwtMiddleware, logout);

module.exports = authRouter;
