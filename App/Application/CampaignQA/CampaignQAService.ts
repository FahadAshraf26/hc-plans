import HttpException from '@infrastructure/Errors/HttpException';
import mailService from '@infrastructure/Service/MailService';
import emailTempaltes from '@domain/Utils/EmailTemplates';
const { campaignQATemplate } = emailTempaltes;
import CreateCampaignQADTO from './CreateCampaignQADTO';
import FindCampaignQADTO from './FindCampaignQADTO';
import GetCampaignQADTO from './GetCampaignQADTO';
import RemoveCampaignQADTO from './RemoveCampaignQADTO';
import UpdateCampaignQADTO from './UpdateCampaignQADTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignQARepositoryId,
  ICampaignQARepository,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  IUserRepository,
  IUserRepositoryId,
} from '../../Domain/Core/User/IUserRepository';
import PaginationData from '@domain/Utils/PaginationData';
import { ICampaignQAService } from '@application/CampaignQA/ICampaignQAService';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import config from '@infrastructure/Config';
import server from '@infrastructure/Config/server';
const { SendHtmlEmail } = mailService;
const { emailConfig } = config;

@injectable()
class CampaignQAService implements ICampaignQAService {
  constructor(
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IPushNotificationServiceId)
    private pushNotificationService: IPushNotificationService,
  ) {}
  /**
   *
   * @param {GetCampaignQADTO} getCampaignQADTO
   */
  async getCampaignQA(getCampaignQADTO: GetCampaignQADTO): Promise<PaginationData<any>> {
    const result = await this.campaignQARepository.fetchByCampaign(
      getCampaignQADTO.getCampaignId(),
      getCampaignQADTO.getPaginationOptions(),
      getCampaignQADTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  /**
   *
   * @param {FindCampaignQADTO} findCampaignQADTO
   */
  async findCampaignQA(findCampaignQADTO: FindCampaignQADTO) {
    const campaignQA = await this.campaignQARepository.fetchById(
      findCampaignQADTO.getCampaignQAId(),
    );

    if (!campaignQA) {
      throw new HttpException(404, 'no campaign QA found with the provided input');
    }

    return campaignQA;
  }

  /**
   *
   * @param {UpdateCampaignQADTO} updateCampaignQADTO
   */
  async updateCampaignQA(updateCampaignQADTO: UpdateCampaignQADTO) {
    const campaignQA = await this.campaignQARepository.fetchById(
      updateCampaignQADTO.getCampaignQAId(),
    );

    if (!campaignQA) {
      throw new HttpException(404, 'no campaign QA found with the provided input');
    }

    const updateResult = await this.campaignQARepository.update(
      updateCampaignQADTO.getCampaignQA(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'campaign qa update failed');
    }

    return updateResult;
  }

  /**
   *
   * @param {RemoveCampaignQADTO} removeCampaignQADTO
   */
  async removeCampaignQA(removeCampaignQADTO: RemoveCampaignQADTO) {
    const campaignQA = await this.campaignQARepository.fetchById(
      removeCampaignQADTO.getCampaignQAId(),
    );

    if (!campaignQA) {
      throw new HttpException(404, 'no campaign QA found with the provided input');
    }

    const deleteResult = await this.campaignQARepository.remove(
      campaignQA,
      removeCampaignQADTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'campaign QA delete failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {CreateCampaignQADTO} createCampaignQADTO
   */
  async createCampaignQA(createCampaignQADTO: CreateCampaignQADTO) {
    const createResult = this.campaignQARepository.add(
      createCampaignQADTO.getCampaignQA(),
    );

    if (!createResult) {
      throw new HttpException(400, 'campaing QA failed');
    }

    const campaignQA = createCampaignQADTO.getCampaignQA();
    const { userId, campaignId } = campaignQA;

    const campaign = await this.campaignRepository.fetchById(campaignId);
    const user = await this.userRepository.fetchById(userId);
    const owners = campaign.issuer.owners;
    const userIds = owners.map((owner) => owner.userId);
    const issuerId = campaign.issuerId;
    if (!userIds.includes(userId)) {
      // send email to owners
      await Promise.allSettled(
        owners.map(async (owner) => {
          const link = server.IS_DEVELOPMENT
            ? `${server.STAGING_WEB_APP_URL}/campaigns/${
                campaign.slug
              }?tab=AskTheFounders&campaignQAId=${createCampaignQADTO.getCampaignQAId()}`
            : `${server.PRODUCTION_WEB_APP_URL}/campaigns/${
                campaign.slug
              }?tab=AskTheFounders&campaignQAId=${createCampaignQADTO.getCampaignQAId()}`;
          const html = campaignQATemplate
            .replace('{@OWNER_NAME}', owner.user.firstName)
            .replace('{@OFFERING_PAGE_LINK}', link);
          return SendHtmlEmail(
            owner.user.email,
            'Someone posted on your offering page! Please respond.',
            html,
            null,
            false,
            null,
            null,
            emailConfig.HONEYCOMB_EMAIL,
          );
        }),
      );

      // send push notification to the owners
      this.pushNotificationService.sendNewCampaignQANotifications(
        campaignQA,
        user,
        owners.map((owner) => owner.user),
        issuerId,
      );
    }

    return createResult;
  }
}

export default CampaignQAService;
