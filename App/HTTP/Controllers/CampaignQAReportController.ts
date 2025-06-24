import CreateCampaignQAReportDTO from '../../Application/CampaignQAReport/CreateCampaignQAReportDTO';
import GetCampaignReportByCampaignQADTO from '../../Application/CampaignQAReport/GetCampaignQAReportByCampaignDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignQAReportService,
  ICampaignQAReportServiceId,
} from '@application/CampaignQAReport/ICampaignQAReportService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignQAReportController {
  constructor(
    @inject(ICampaignQAReportServiceId)
    private campaignQAReportService: ICampaignQAReportService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignQAReport = async (httpRequest) => {
    const { campaignQAId, campaignId } = httpRequest.params;
    const { userId } = httpRequest.decoded;
    const { text } = httpRequest.body;

    const input = new CreateCampaignQAReportDTO(campaignQAId, userId, campaignId, text);
    await this.campaignQAReportService.createCampaignQAReport(input);

    return {
      body: {
        status: 'success',
        message: 'campaign question/reply reported successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignQAReportByCampaignQA = async (httpRequest) => {
    const { campaignQAId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCampaignReportByCampaignQADTO(
      campaignQAId,
      page,
      perPage,
      showTrashed,
    );
    const result = await this.campaignQAReportService.getCampaignQAReportByCampaignQA(
      input,
    );

    return { body: result };
  };
}

export default CampaignQAReportController;
