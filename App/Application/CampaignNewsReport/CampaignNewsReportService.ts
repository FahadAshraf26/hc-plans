import GetCampaignNewsReportByCampaignNewsDTO from '@application/CampaignNewsReport/GetCampaignNewsReportByCampaignDTO';
import CreateCampaignNewsReportDTO from '@application/CampaignNewsReport/CreateCampaignNewsReportDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import emailTemplates from '@domain/Utils/EmailTemplates';
const { campaignNewsReportAbuseTemplate } = emailTemplates;
import mailService from '@infrastructure/Service/MailService';
const { SendHtmlEmail } = mailService;
import { inject, injectable } from 'inversify';
import {
  ICampaignNewsReportRepository,
  ICampaignNewsReportRepositoryId,
} from '@domain/Core/CampaignNewsReport/ICampaignNewsReportRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { ICampaignNewsReportService } from '@application/CampaignNewsReport/ICampaignNewsReportService';
import config from '@infrastructure/Config';
const { emailConfig } = config;

@injectable()
class CampaignNewsReportService implements ICampaignNewsReportService {
  constructor(
    @inject(ICampaignNewsReportRepositoryId)
    private campaignNewsReportRepository: ICampaignNewsReportRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignNewsRepositoryId)
    private campaignNewsRepository: ICampaignNewsRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}
  async createCampaignNewsReport(
    createCampaignNewsReportDTO: CreateCampaignNewsReportDTO,
  ): Promise<boolean> {
    const campaign = await this.campaignRepository.fetchById(
      createCampaignNewsReportDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(400, 'invalid resource id');
    }

    const campaignNews = await this.campaignNewsRepository.fetchById(
      createCampaignNewsReportDTO.getCampaignNewsReport().campaignNewsId,
    );

    if (!campaignNews) {
      throw new HttpException(400, 'invalid resource Id or question deleted');
    }

    const createResult = await this.campaignNewsReportRepository.add(
      createCampaignNewsReportDTO.getCampaignNewsReport(),
    );

    if (!createResult) {
      throw new HttpException(400, 'failed to report question');
    }

    const reportCount: any = await this.campaignNewsReportRepository.fetchCountByCampaignNews(
      createCampaignNewsReportDTO.getCampaignNewsReport().campaignNewsId,
    );

    const [userThatReported] = await Promise.all([
      this.userRepository.fetchById(
        createCampaignNewsReportDTO.getCampaignNewsReport().userId,
        true,
      ),
    ]);

    const html = campaignNewsReportAbuseTemplate
      .replace('{@EMAIL}', userThatReported.email)
      .replace('{@TITLE}', campaignNews.title)
      .replace('{@CAMPAIGN_NAME}', campaign.campaignName)
      .replace('{@REPORT_COUNT}', reportCount)
      .replace('{@FEEDBACK}', createCampaignNewsReportDTO.getCampaignNewsReport().text);

    await SendHtmlEmail(
      emailConfig.HONEYCOMB_EMAIL,
      'Business Updates Abuse Reported!',
      html,
    );

    return createResult;
  }

  async getCampaignNewsReportByCampaignNews(
    getCampaignNewsReportByCampaignNewsDTO: GetCampaignNewsReportByCampaignNewsDTO,
  ): Promise<any> {
    const result = await this.campaignNewsReportRepository.fetchByCampaignNews(
      getCampaignNewsReportByCampaignNewsDTO.getCampaignNewsId(),
    );

    return result.getPaginatedData();
  }
}

export default CampaignNewsReportService;
