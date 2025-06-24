import GetCampaignNewsDTO from '@application/CampaignNews/GetCampaignNewsDTO';
import FindCampaignNewsDTO from '@application/CampaignNews/FindCampaignNewsDTO';
import CampaignNews from '@domain/Core/CampaignNews/CampaignNews';
import UpdateCampaignNewsDTO from '@application/CampaignNews/UpdateCampaignNewsDTO';
import RemoveCampaignNewsDTO from '@application/CampaignNews/RemoveCampaignNewsDTO';
import CreateCampaignNewsDTO from '@application/CampaignNews/CreateCampaignNewsDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import {
  ICampaignNewsMediaDAO,
  ICampaignNewsMediaDaoId,
} from '@domain/Core/CampaignNewsMedia/ICampaignNewsMediaDAO';
import { ICampaignNewsService } from '@application/CampaignNews/ICampaignNewsService';
import HttpException from '@infrastructure/Errors/HttpException';
import { unlink, exists } from 'fs';
import { promisify } from 'util';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import mailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import {
  ICampaignNotificationRepository,
  ICampaignNotificationRepositoryId,
} from '@domain/Core/CampaignNotification/ICampaignNotification';
import CampaignNotification from '@domain/Core/CampaignNotification/CampaignNotification';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import NotificationService from '@infrastructure/Service/NotificationService/NotificationService';
import { INotificationServiceId } from '@infrastructure/Service/NotificationService/INotificationService';

const { SendHtmlEmail } = mailService;
const { server } = config;
const { businessUpdateTemplate } = EmailTemplates;
const DeleteFile = promisify(unlink);
const FileExists = promisify(exists);

@injectable()
class CampaignNewsService implements ICampaignNewsService {
  constructor(
    @inject(ICampaignNewsRepositoryId)
    private campaignNewRepository: ICampaignNewsRepository,
    @inject(ICampaignNewsMediaDaoId) private campaignNewsMediaDao: ICampaignNewsMediaDAO,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignNotificationRepositoryId)
    private campaignNotificationRepository: ICampaignNotificationRepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
    @inject(INotificationServiceId)
    private notificationService: NotificationService,
  ) {}
  /**
   * get all campaign news for a campaign
   * @param {object} getCampaignNewsDTO
   * @returns CampaignNews[]
   */
  async getCampaignNews(getCampaignNewsDTO: GetCampaignNewsDTO): Promise<any> {
    const result = await this.campaignNewRepository.fetchByCampaign(
      getCampaignNewsDTO.getCampaignId(),
      {
        paginationOptions: getCampaignNewsDTO.getPaginationOptions(),
        showTrashed: getCampaignNewsDTO.isShowTrashed(),
        query: getCampaignNewsDTO.getQuery(),
      },
    );

    return result.getPaginatedData();
  }

  /**
   * find campaign news
   * @param {object} findCampaignNewsDTO
   * @returns CampaignNews
   */
  async findCampaignNews(
    findCampaignNewsDTO: FindCampaignNewsDTO,
  ): Promise<CampaignNews> {
    const campaignNews = await this.campaignNewRepository.fetchById(
      findCampaignNewsDTO.getCampaignNewsId(),
    );

    if (!campaignNews) {
      throw new HttpException(
        404,
        'no campaign news record exists against provided input',
      );
    }

    return campaignNews;
  }

  /**
   * update campaign news
   * @param {object} updateCampaignNews
   * @returns boolean
   */
  async updateCampaignNews(updateCampaignNews: UpdateCampaignNewsDTO): Promise<boolean> {
    const campaignNews = await this.campaignNewRepository.fetchById(
      updateCampaignNews.getCampaignNewsId(),
    );

    if (!campaignNews) {
      throw new HttpException(
        404,
        'no campaign news record exists against provided input',
      );
    }

    const MediaToDelete = campaignNews.campaignMedia.filter(
      (media) =>
        updateCampaignNews
          .getCampaignNews()
          .campaignMedia.findIndex(
            (inputMedia) => inputMedia.campaignNewsMediaId === media.campaignNewsMediaId,
          ) === -1,
    );

    const deleteOps = MediaToDelete.map((media) => {
      return this.campaignNewsMediaDao.remove(media, true);
    });
    // const deleteFileOps = MediaToDelete.map((media) => {
    //   return DeleteFile(media.path);
    // });
    await Promise.all([
      ...deleteOps,
      // ...deleteFileOps
    ]);

    const updateResult = await this.campaignNewRepository.update(
      updateCampaignNews.getCampaignNews(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'campaign news update failed');
    }

    return updateResult;
  }

  /**
   * delete campaign news
   * @param {object} removeCampaignNewsDTO
   */
  async removeCampaignNews(
    removeCampaignNewsDTO: RemoveCampaignNewsDTO,
  ): Promise<boolean> {
    const campaignNews = await this.campaignNewRepository.fetchById(
      removeCampaignNewsDTO.getCampaignNewsId(),
    );
    if (!campaignNews) {
      throw new HttpException(
        404,
        'no campaign news record exists against provided input',
      );
    }

    const deleteResult = await this.campaignNewRepository.remove(
      campaignNews,
      removeCampaignNewsDTO.shouldHardDelete(),
    );

    if (removeCampaignNewsDTO.shouldHardDelete()) {
      for (const media of campaignNews.campaignMedia) {
        const fileExists = await FileExists(media.path);
        if (fileExists) {
          await DeleteFile(media.path);
        }
      }
    }

    if (!deleteResult) {
      throw new HttpException(400, 'campaign news delete failed');
    }

    return deleteResult;
  }

  async sendBusinessUpdateEmailToInvestor(campaignFunds, campaignNewsId, campaignNews) {
    Promise.all(
      campaignFunds.map(async (campaignFund) => {
        const campaignUrl = server.IS_DEVELOPMENT
          ? `${server.STAGING_WEB_APP_URL}/campaigns/${campaignFund.slug}?tab=StartupNews`
          : `${server.PRODUCTION_WEB_APP_URL}/campaigns/${campaignFund.slug}?tab=StartupNews`;
        const html = businessUpdateTemplate
          .replace('{@FNAME}', campaignFund.firstName)
          .replace('{@CAMPAIGN_NAME}', campaignFund.campaignName)
          .replace('{@CAMPAIGN_URL}', campaignUrl)
          .replace('{@HYPER_LINK}', campaignNews.hyperLink)
          .replace('{@HYPER_LINK_TEXT}', campaignNews.hyperLinkText);

        await SendHtmlEmail(
          campaignFund.email,
          `${campaignFund.campaignName} has posted a new update!`,
          html,
        );
        const notificationObject = { isSeen: false };
        const campaignNotification = CampaignNotification.createFromDetail(
          notificationObject,
        );
        campaignNotification.setCampaignId(campaignFund.campaignId);
        campaignNotification.setInvestorId(campaignFund.investorId);
        campaignNotification.setCampaignNewsId(campaignNewsId);
        await this.campaignNotificationRepository.add(campaignNotification);
      }),
    );

    return;
  }

  async sendBusinessUpdateEmailToInterestedInvestor(
    favoriteCampaigns,
    campaignNewsId,
    campaignNews,
  ) {
    Promise.all(
      favoriteCampaigns.map(async (favoriteCampaign) => {
        const investor = favoriteCampaign.investor;
        const campaign = favoriteCampaign.campaign;
        const user = investor.user;
        const campaignUrl = server.IS_DEVELOPMENT
          ? `${server.STAGING_WEB_APP_URL}/campaigns/${campaign.slug}?tab=StartupNews`
          : `${server.PRODUCTION_WEB_APP_URL}/campaigns/${campaign.slug}?tab=StartupNews`;
        const html = businessUpdateTemplate
          .replace('{@FNAME}', user.firstName)
          .replace('{@CAMPAIGN_NAME}', campaign.campaignName)
          .replace('{@CAMPAIGN_URL}', campaignUrl)
          .replace('{@HYPER_LINK}', campaignNews.hyperLink)
          .replace('{@HYPER_LINK_TEXT}', campaignNews.hyperLinkText);

        await SendHtmlEmail(
          user.email,
          `${campaign.campaignName} has posted a new update!`,
          html,
        );
        const notificationObject = { isSeen: false };
        const campaignNotification = CampaignNotification.createFromDetail(
          notificationObject,
        );
        campaignNotification.setCampaignId(campaign.campaignId);
        campaignNotification.setInvestorId(investor.investorId);
        campaignNotification.setCampaignNewsId(campaignNewsId);
        await this.campaignNotificationRepository.add(campaignNotification);
      }),
    );
  }

  async sendBusinessUpdatePushNotificationToInterestedInvestor(favoriteCampaigns, campaignFunds) {
    const favFcmTokens = favoriteCampaigns
      .map((favoriteCampaign) => {
        const investor = favoriteCampaign.investor;
        const user = investor.user;
        return user.fcmToken;
      })
      .filter((token) => token != undefined);

    const details = campaignFunds.reduce(
      ({ fcmTokens }, { fcmToken, campaignName, slug }) => {
        return {
          campaignName: campaignName,
          slug: slug,
          fcmTokens: [...fcmTokens, fcmToken],
        };
      },
      { campaignName: '', fcmTokens: [], slug: '' },
    );

    const uniqueTokens = [...details.fcmTokens, ...favFcmTokens].filter((value, index, array) => {
      return value != null && array.indexOf(value) === index;
    });

    const message = {
      data: {
        campaignName: details.campaignName,
        body: `${details.campaignName} has posted an update. Check it out now!`,
        slug: details.slug,
      },
      notification: {title: 'Honeycomb Credit', body: `${details.campaignName} has posted an update. Check it out now!` },
      tokens: uniqueTokens.filter(token => token != null),
    };

    await this.notificationService.sendMulticastNotifications(message);
  }

  /**
   * create campaign news
   * @param {object} createCampaignNewsDTO
   */
  async createCampaignNews(
    createCampaignNewsDTO: CreateCampaignNewsDTO,
  ): Promise<boolean> {
    const createResult = await this.campaignNewRepository.add(
      createCampaignNewsDTO.getCampaignNews(),
    );
    const campaignNewsId = createCampaignNewsDTO.getCampaignNews().getCampaignNewsId();
    if (!createResult) {
      throw new HttpException(400, 'campaign news create failed');
    }
    const favoriteCampaigns = await this.favoriteCampaignRepository.fetchAllByCampaign(
      createCampaignNewsDTO.getCampaignId(),
    );
    const campaignFunds = await this.campaignFundRepository.fetchByCampaignForNotification(
      createCampaignNewsDTO.getCampaignId(),
    );

    this.sendBusinessUpdateEmailToInvestor(
      campaignFunds,
      campaignNewsId,
      createCampaignNewsDTO.getCampaignNews(),
    );

    this.sendBusinessUpdateEmailToInterestedInvestor(
      favoriteCampaigns,
      campaignNewsId,
      createCampaignNewsDTO.getCampaignNews(),
    );

    this.sendBusinessUpdatePushNotificationToInterestedInvestor(favoriteCampaigns, campaignFunds);

    return createResult;
  }
}

export default CampaignNewsService;
