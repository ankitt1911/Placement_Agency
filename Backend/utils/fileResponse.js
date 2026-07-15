const path = require("path");

const toPublicFilePath = (file) => {
  if (!file) return "";
  return `/uploads/${path.basename(file.path)}`;
};

module.exports = { toPublicFilePath };
