const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const signupOTPTemplate = require("../emailTemplates/auth/signupOTPTemplate");
const { noReplyTransporter } = require("../config/transporter");

const sendSignupOTPEmail = async ({ to, name, otp, validMinutes }) => {
  const mailOptions = {
    from: process.env.HOSTINGER_EMAIL_FROM || process.env.HOSTINGER_EMAIL_USER,
    to,
    subject: "Verify your Magnus Copo account",
    html: signupOTPTemplate({ name, otp, validMinutes }),
  };

  try {
    await noReplyTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending signup OTP email:", error);
    return false;
  }
};

const sendPasswordResetOTPEmail = async ({ to, name, otp, validMinutes }) => {
  const mailOptions = {
    from: process.env.HOSTINGER_EMAIL_FROM || process.env.HOSTINGER_EMAIL_USER,
    to,
    subject: "Reset your Magnus Copo password",
    html: signupOTPTemplate({
      name,
      otp,
      validMinutes,
      heading: "Reset your password",
      intro: "use the OTP below to continue resetting your password",
    }),
  };

  try {
    await noReplyTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
    return false;
  }
};

module.exports = { sendSignupOTPEmail, sendPasswordResetOTPEmail };
