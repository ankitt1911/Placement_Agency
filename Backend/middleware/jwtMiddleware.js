const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const jwtMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ success: false, message: "Authorization token missing", statusCode: 403 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.mongoId).select("_id email role isActive").lean();
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid or inactive user", statusCode: 401 });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token", statusCode: 401 });
  }
};

module.exports = jwtMiddleware;
