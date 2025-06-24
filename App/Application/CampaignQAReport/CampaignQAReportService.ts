import CreateCampaignQAReportDTO from './CreateCampaignQAReportDTO';
import GetCampaignQAReportByCampaignDTO from './GetCampaignQAReportByCampaignDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignQAReportRepository,
  ICampaignQAReportRepositoryId,
} from '@domain/Core/CampaignQAReport/ICampaignQAReportRepository';
import { ICampaignQAReportService } from '@application/CampaignQAReport/ICampaignQAReportService';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import HttpException from '../../Infrastructure/Errors/HttpException';
import emailTemplates from '@domain/Utils/EmailTemplates';
const { campaignQAReportAbuseTemplate } = emailTemplates;
import mailService from '@infrastructure/Service/MailService';
import config from '../../Infrastructure/Config';
import CampaignQAReport from '@domain/Core/CampaignQAReport/CampaignQAReport';
const { SendHtmlEmail } = mailService;
const { emailConfig } = config;

type campaignReportResponse = {
  status: string;
  paginationInfo: any;
  data: Array<CampaignQAReport>;
};

@injectable()
class CampaignQAReportService implements ICampaignQAReportService {
  constructor(
    @inject(ICampaignQAReportRepositoryId)
    private campaignQAReportRepository: ICampaignQAReportRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async createCampaignQAReport(
    createCampaignQAReportDTO: CreateCampaignQAReportDTO,
  ): Promise<boolean> {
    const campaign = await this.campaignRepository.fetchById(
      createCampaignQAReportDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(400, 'invalid resource id');
    }

    const campaignQA = await this.campaignQARepository.fetchById(
      createCampaignQAReportDTO.getCampaignQAReport().campaignQAId,
    );

    if (!campaignQA) {
      throw new HttpException(400, 'invalid resource Id or question deleted');
    }

    const createResult = await this.campaignQAReportRepository.add(
      createCampaignQAReportDTO.getCampaignQAReport(),
    );

    if (!createResult) {
      throw new HttpException(400, 'failed to report question');
    }

    const reportCount: any = await this.campaignQAReportRepository.fetchCountByCampaignQA(
      createCampaignQAReportDTO.getCampaignQAReport().campaignQAId,
    );

    const [userThatReported, userThatPostedQuestion] = await Promise.all([
      this.userRepository.fetchById(
        createCampaignQAReportDTO.getCampaignQAReport().userId,
        true,
      ),
      this.userRepository.fetchById(campaignQA.userId, true),
    ]);

    const html = campaignQAReportAbuseTemplate
      .replace('{@EMAIL}', userThatReported.email)
      .replace('{@EMAIL2}', userThatPostedQuestion.email)
      .replace('{@CAMPAIGN_NAME}', campaign.campaignName)
      .replace('{@REPORT_COUNT}', reportCount)
      .replace('{@FEEDBACK}', createCampaignQAReportDTO.getCampaignQAReport().text);

    await SendHtmlEmail(
      emailConfig.HONEYCOMB_EMAIL,
      'Campaign Q/A Abuse Reported!',
      html,
    );

    return createResult;
  }

  async getCampaignQAReportByCampaignQA(
    getCampaignQAReportByCampaignQADTO: GetCampaignQAReportByCampaignDTO,
  ): Promise<campaignReportResponse> {
    const result = await this.campaignQAReportRepository.fetchByCampaignQA(
      getCampaignQAReportByCampaignQADTO.getCampaignQAId(),
      {
        paginationOptions: getCampaignQAReportByCampaignQADTO.getPaginationOptions(),
        showTrashed: getCampaignQAReportByCampaignQADTO.isShowTrashed(),
      },
    );

    return result.getPaginatedData();
  }
}

export default CampaignQAReportService;
