import {
  ChangePasswordApi,
  ForgotPasswordApi,
  LoginApi,
  LogoutApi,
  RegisterApi,
  ResendSignupOtpApi,
  ResetPasswordApi,
  VerifyForgotPasswordOtpApi,
  VerifySignupOtpApi,
} from "../apiMethod";

const handleLogin = async (params) => {
  try {
    const response = await LoginApi({ email: params.email, password: params.password });
    return response?.token && response?.user ? { token: response.token, user: response.user } : null;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

const handleLogout = async () => LogoutApi();
const handleGetCurrentUser = async () => JSON.parse(localStorage.getItem("currentUser") || "null");
const handleRegister = async (params) => {
  try {
    const response = await RegisterApi({
      name: params.name,
      email: params.email,
      password: params.password,
      mobile: params.mobile || null
    });
    return response?.data || response?.raw?.data || null;
  } catch (error) {
    console.error("Error during registration:", error);
    return null;
  }
};

const handleVerifySignupOtp = async (params) => {
  try {
    const response = await VerifySignupOtpApi({ email: params.email, otp: params.otp });
    return response?.data || response?.raw?.data || null;
  } catch (error) {
    console.error("Error during signup OTP verification:", error);
    return null;
  }
};

const handleResendSignupOtp = async (params) => {
  try {
    const response = await ResendSignupOtpApi({ email: params.email });
    return response?.data || response?.raw?.data || null;
  } catch (error) {
    console.error("Error during signup OTP resend:", error);
    return null;
  }
};

const handleForgotPassword = async (params) => {
  try {
    const response = await ForgotPasswordApi({ email: params.email });
    return response?.data || response?.raw?.data || null;
  } catch (error) {
    console.error("Error during forgot password:", error);
    return null;
  }
};

const handleVerifyForgotPasswordOtp = async (params) => {
  try {
    const response = await VerifyForgotPasswordOtpApi({ email: params.email, otp: params.otp });
    return response?.data || response?.raw?.data || null;
  } catch (error) {
    console.error("Error during forgot password OTP verification:", error);
    return null;
  }
};

const handleResetPassword = async (params) => {
  try {
    await ResetPasswordApi({
      email: params.email,
      newPassword: params.newPassword,
      confirmPassword: params.confirmPassword,
    });
    return true;
  } catch (error) {
    console.error("Error during password reset:", error);
    return false;
  }
};

// The api interceptor already toasts the server message on failure, so only the outcome is reported back.
const handleChangePassword = async (params) => {
  try {
    const response = await ChangePasswordApi({
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
      confirmPassword: params.confirmPassword
    });
    return { success: true, message: response?.message || "Password updated successfully" };
  } catch (error) {
    return { success: false, message: error?.message || "Unable to update password" };
  }
};

export {
  handleLogin,
  handleLogout,
  handleGetCurrentUser,
  handleRegister,
  handleVerifySignupOtp,
  handleResendSignupOtp,
  handleForgotPassword,
  handleVerifyForgotPasswordOtp,
  handleResetPassword,
  handleChangePassword,
};
