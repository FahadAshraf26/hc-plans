import Excel from 'exceljs';
import { IExcelService } from '@infrastructure/Service/ExcelService/IExcelService';
import { injectable } from 'inversify';

@injectable()
class ExcelService implements IExcelService {
  /**
   * @returns {Excel.Workbook}
   */
  createWorkbook() {
    return new Excel.Workbook();
  }

  /**
   *
   * @param {!Excel.Workbook} workBook
   * @param {!string} sheetName
   * @returns {Excel.Worksheet}
   */
  createWorksheet(workBook, sheetName) {
    return workBook.addWorksheet(sheetName);
  }

  getDefaultColumnStyles({ isHeader = false }) {
    return {
      font: {
        name: 'Arial',
        family: 2,
        bold: isHeader,
      },
    };
  }

  /**
   *
   * @typedef {!{header:string,dataKey}} ColumnsData
   * @param {!Excel.Worksheet} workSheet
   * @param {!ColumnsData[]} columnsData
   * @param {boolean} [boldHeaders = true]
   */
  specifyWorkSheetColumns(workSheet, columnsData, boldHeaders = true) {
    workSheet.columns = columnsData.map((col) => ({
      ...col,
      key: col.dataKey,
      width: 15,
      style: this.getDefaultColumnStyles({}),
    }));

    if (boldHeaders) {
      workSheet.getRow(1).eachCell((cell) => {
        cell.style = this.getDefaultColumnStyles({
          isHeader: true,
        });
      });
    }
  }
}

export default ExcelService;
