const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const nodemailer = require("nodemailer");

const noReplyTransporter = nodemailer.createTransport({
  host: process.env.HOSTINGER_SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.HOSTINGER_SMTP_PORT || 465),
  secure: String(process.env.HOSTINGER_SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.HOSTINGER_EMAIL_USER,
    pass: process.env.HOSTINGER_EMAIL_PASSWORD,
  },
});

module.exports = { noReplyTransporter };
