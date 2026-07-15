import { LoginApi, LogoutApi, RegisterApi } from "../apiMethod";

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

export { handleLogin, handleLogout, handleGetCurrentUser, handleRegister };
