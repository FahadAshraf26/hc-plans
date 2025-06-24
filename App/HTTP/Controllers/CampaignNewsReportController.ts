import { inject, injectable } from 'inversify';
import CreateCampaignNewsReportDTO from '../../Application/CampaignNewsReport/CreateCampaignNewsReportDTO';
import {
  ICampaignNewsReportService,
  ICampaignNewsReportServiceId,
} from '@application/CampaignNewsReport/ICampaignNewsReportService';
import GetCampaignReportByCampaignNewsDTO from '../../Application/CampaignNewsReport/GetCampaignNewsReportByCampaignDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignNewsReportController {
  constructor(
    @inject(ICampaignNewsReportServiceId)
    private campaignNewsReportService: ICampaignNewsReportService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignNewsReport = async (httpRequest) => {
    const { campaignNewsId, campaignId } = httpRequest.params;
    const { userId } = httpRequest.decoded;
    const { text } = httpRequest.body;

    const input = new CreateCampaignNewsReportDTO(
      campaignNewsId,
      userId,
      campaignId,
      text,
    );

    await this.campaignNewsReportService.createCampaignNewsReport(input);

    return {
      body: {
        status: 'success',
        message: 'business update reported successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignNewsReportByCampaignNews = async (httpRequest) => {
    const { campaignNewsId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCampaignReportByCampaignNewsDTO(
      campaignNewsId,
      page,
      perPage,
      showTrashed,
    );
    const result = await this.campaignNewsReportService.getCampaignNewsReportByCampaignNews(
      input,
    );

    return { body: result };
  };
}

export default CampaignNewsReportController;
