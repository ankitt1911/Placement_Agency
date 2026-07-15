import { createSlice } from "@reduxjs/toolkit";

const validRoles = ["student", "operations"];

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("currentUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user && validRoles.includes(user.role) ? user : null;
  } catch {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    return null;
  }
};

const storedUser = localStorage.getItem("currentUser");
const parsedUser = storedUser ? parseStoredUser() : null;
const storedToken = localStorage.getItem("token");

const initialState = {
  isAuthenticated: Boolean(storedToken && parsedUser),
  token: storedToken,
  user: parsedUser,
  role: parsedUser?.role || null,
  isAuthChecked: false
};

const loginSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.role = user?.role || null;
      state.isAuthChecked = true;
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthChecked = true;
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    },
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      const user = parseStoredUser();
      const isValidSession = Boolean(token && user);
      if (!isValidSession) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      }
      state.isAuthenticated = isValidSession;
      state.token = isValidSession ? token : null;
      state.user = user;
      state.role = user?.role || null;
      state.isAuthChecked = true;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  }
});

export const { login, logout, checkAuth, setAuthChecked } = loginSlice.actions;
export default loginSlice.reducer;
