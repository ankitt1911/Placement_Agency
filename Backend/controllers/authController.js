const { registerSchema, loginSchema } = require("../validators/authValidators");
const { fetchRegister, fetchLogin, fetchRefreshToken, fetchLogout } = require("../services/authService");

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

const refreshToken = async (req, res) => fetchRefreshToken(req, res);
const logout = async (req, res) => fetchLogout(req, res);

module.exports = { register, login, refreshToken, logout };
