const express = require("express");
const authRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { register, login, refreshToken, logout } = require("../controllers/authController");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", jwtMiddleware, refreshToken);
authRouter.post("/logout", jwtMiddleware, logout);

module.exports = authRouter;
