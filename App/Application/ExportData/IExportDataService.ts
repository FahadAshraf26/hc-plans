import GetAllExportDataDTO from './GetAllExportDataDTO';

export const IExportDataServiceId = Symbol('IExportDataService');

export interface IExportDataService {
  getAllExportedData(getAllExportDataDTO: GetAllExportDataDTO): Promise<any>;
  getSignedUrl(documentPath: string): Promise<any>;
  exportCampaignTagData(adminUser: any): Promise<any>;
  exportAllUsersInvestments(adminUser: any): Promise<any>;
}
