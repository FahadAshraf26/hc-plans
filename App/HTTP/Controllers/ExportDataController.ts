import GetAllExportDataDTO from '@application/ExportData/GetAllExportDataDTO';
import {
  IExportDataService,
  IExportDataServiceId,
} from '@application/ExportData/IExportDataService';
import { inject, injectable } from 'inversify';

@injectable()
class ExportDataController {
  constructor(
    @inject(IExportDataServiceId) private exportDataService: IExportDataService,
  ) { }

  getAllExport = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;
    const input = new GetAllExportDataDTO(page, perPage);
    const data = await this.exportDataService.getAllExportedData(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getSignedUrl = async (httpRequest) => {
    const { documentPath } = httpRequest.body;
    const data = await this.exportDataService.getSignedUrl(documentPath);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getAllCampaignTags = async (httpRequest) => {
    await this.exportDataService.exportCampaignTagData(httpRequest.adminUser);
    return {
      body: {
        status: 'success',
        message: "We received your request. You will be notified when file's generated!",
      },
    };
  };

  getAllUsersInvestments = async (httpRequest) => {
    await this.exportDataService.exportAllUsersInvestments(httpRequest.adminUser);
    return {
      body: {
        status: 'success',
        message: "We received your request. You will be notified when file's generated!",
      },
    };
  };
}

export default ExportDataController;
