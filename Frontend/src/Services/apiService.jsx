import axios from "axios";
import { ErrorMessage } from "../Utlis/Toastify/ToastMessage";
import store from "../ReduxStore/store";
import { logout } from "../ReduxFeature/Authenthicate/LoginSlice";

const ApiRequest = axios.create({
  baseURL:"https://placement-agency.onrender.com/api",
  timeout: 20000
});

ApiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ApiRequest.interceptors.response.use(
  (response) => ({
    statusCode: response.status || false,
    token: response.data?.token || response.data?.["auth-token"] || null,
    userId: response.data?.userId || null,
    message: response.data?.message || null,
    data: response.data?.data,
    total: response.data?.total,
    page: response.data?.page,
    limit: response.data?.limit,
    user: response.data?.user,
    raw: response.data,
    blob: response.data instanceof Blob ? response.data : null
  }),
  (error) => {
    const statusCode = error?.response?.status;
    const message = error?.response?.data?.message;
    if (statusCode === 401) {
      localStorage.clear();
      store.dispatch(logout());
      ErrorMessage(message || "Session expired");
    } else if ([403, 404, 422, 500].includes(statusCode)) {
      ErrorMessage(message);
    } else if (error.code === "ERR_NETWORK") {
      ErrorMessage("Network Error!! Connection refused error.");
    } else {
      ErrorMessage("Unexpected Error Occurred!");
    }
    return Promise.reject({ statusCode, message, data: null });
  }
);

const apiRequest = (
  url,
  method,
  params = {},
  formDataFlag = false,
  extraHeaders = {},
  responseType = "json"
) => {
  const normalizedMethod = method.toLowerCase();
  return ApiRequest({
    url,
    method: normalizedMethod,
    headers: { ...extraHeaders },
    params: normalizedMethod === "get" && !formDataFlag ? params : null,
    data: formDataFlag || normalizedMethod !== "get" ? params : null,
    responseType
  });
};

export default apiRequest;
