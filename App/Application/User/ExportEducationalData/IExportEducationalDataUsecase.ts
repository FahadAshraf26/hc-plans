import ExportEducationalDataDTO from "./ExportEducationalDataDTO";

export const IExportEducationalDataUsecaseId = Symbol.for('IExportEducationalDataUsecase');

export interface IExportEducationalDataUsecase {
  execute(exportEducationlData: ExportEducationalDataDTO): Promise<any>;
}