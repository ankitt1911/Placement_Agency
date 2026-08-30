const {
  registerSchema,
  loginSchema,
  verifySignupOtpSchema,
  resendSignupOtpSchema,
  forgotPasswordSchema,
  verifyForgotPasswordOtpSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validators/authValidators");
const {
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
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    await fetchRegister(req, res);
  } catch (error) {
    console.error("Error Register:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const verifySignupOtp = async (req, res) => {
  try {
    const { error, value } = verifySignupOtpSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchVerifySignupOtp(req, res);
  } catch (error) {
    console.error("Error Verify Signup OTP:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const resendSignupOtp = async (req, res) => {
  try {
    const { error, value } = resendSignupOtpSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchResendSignupOtp(req, res);
  } catch (error) {
    console.error("Error Resend Signup OTP:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchForgotPassword(req, res);
  } catch (error) {
    console.error("Error Forgot Password:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { error, value } = verifyForgotPasswordOtpSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchVerifyForgotPasswordOtp(req, res);
  } catch (error) {
    console.error("Error Verify Forgot Password OTP:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchResetPassword(req, res);
  } catch (error) {
    console.error("Error Reset Password:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchLogin(req, res);
  } catch (error) {
    console.error("Error Login:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
    req.body = value;
    await fetchChangePassword(req, res);
  } catch (error) {
    console.error("Error Change Password:", error);
    return res.status(500).json({ success: false, message: error.message, statusCode: 500 });
  }
};

const refreshToken = async (req, res) => fetchRefreshToken(req, res);
const logout = async (req, res) => fetchLogout(req, res);

module.exports = {
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
};
