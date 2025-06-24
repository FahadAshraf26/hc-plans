export const IExcelServiceId = Symbol.for('IExcelService');
export interface IExcelService {
  createWorkbook();
  createWorksheet(workBook, sheetName);
  getDefaultColumnStyles({ isHeader });
  specifyWorkSheetColumns(workSheet, columnsData, boldHeaders);
}
