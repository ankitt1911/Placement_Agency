import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

export const SuccessMessage = (message) => toast.success(message || "Success", defaultOptions);
export const ErrorMessage = (message) => toast.error(message || "Something went wrong", defaultOptions);
export const WarningMessage = (message) => toast.warning(message || "Please check the details", defaultOptions);
