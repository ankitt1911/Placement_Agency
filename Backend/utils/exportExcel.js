const ExcelJS = require("exceljs");

const exportExcel = async ({ rows, sheetName = "Sheet1" }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  const safeRows = rows || [];

  if (safeRows.length) {
    worksheet.columns = Object.keys(safeRows[0]).map((key) => ({
      header: key,
      key,
      width: Math.max(key.length + 2, 16),
    }));
    worksheet.addRows(safeRows);
  }

  return workbook.xlsx.writeBuffer();
};

module.exports = { exportExcel };
