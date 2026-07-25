import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-country-state-city/dist/react-country-state-city.css";
import "./Utlis/Toastify/CustomToastiy.css";
import "./index.css";
import App from "./App.jsx";
import store from "./ReduxStore/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
