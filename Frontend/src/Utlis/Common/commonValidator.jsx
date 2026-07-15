export const isRequired = (value, label = "Field") => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return `${label} is required`;
  }
  return "";
};

export const isEmail = (value) => {
  if (!value) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email";
};

export const isMobile = (value) => {
  if (!value) return "";
  return /^[0-9]{10}$/.test(value) ? "" : "Enter a valid 10 digit mobile number";
};

export const isPercentage = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(value);
  return number >= 0 && number <= 100 ? "" : "Percentage must be between 0 and 100";
};

export const isCgpa = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(value);
  return number >= 0 && number <= 10 ? "" : "CGPA must be between 0 and 10";
};

export const isUrl = (value) => {
  if (!value) return "";
  try {
    new URL(value);
    return "";
  } catch {
    return "Enter a valid URL";
  }
};

export const isSalary = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  return Number(value) >= 0 ? "" : "Salary must be a positive number";
};

export const validateAllowedFile = (file, allowedTypes, maxMb = 5) => {
  if (!file) return "Please choose a file";
  if (!allowedTypes.includes(file.type)) return "File type is not supported";
  if (file.size > maxMb * 1024 * 1024) return `File must be under ${maxMb}MB`;
  return "";
};
