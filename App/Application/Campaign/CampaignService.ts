import {
  IDeleteProjectionReturnsId,
  IDeleteProjectionReturns,
} from '@application/Campaign/DeleteProjectionReturns/IDeleteProjectionReturns';
import {
  IStorageServiceId,
  IStorageService,
} from '@infrastructure/Service/StorageService/IStorageService';
import {
  ICampaignDocumentRepository,
  ICampaignDocumentRepositoryId,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import UpdateCampaignDTO from '@application/Campaign/UpdateCampaignDTO';
import RemoveCampaignDTO from '@application/Campaign/RemoveCampaignDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import moment from 'moment';
import logger from '@infrastructure/Logger/logger';
import CampaignStatusService from '@domain/Services/Campaigns/CampaignStatusService';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import CampaignNotificationFactory from '../CampaignNotification/CampaignNotificationFactory';
import { inject, injectable } from 'inversify';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import { ICampaignService } from '@application/Campaign/ICampaignService';
import {
  ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase,
  ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCaseId,
} from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeThirtyDays/ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import { InvestorInvestmentType } from '@domain/Core/ValueObjects/InvestorInvestmentType';
import {
  ICampaignHoneycombChargeFeeId,
  ICampaignHoneycombChargeFeeRepository,
} from '@domain/Core/CampaignHoneycombChargeFee/ICampaignHoneycombChargeFeeRepository';
import CampaignHoneycombChargeFee from '@domain/Core/CampaignHoneycombChargeFee/CampaignHoneycombChargeFee';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import Config from '@infrastructure/Config';
import path from 'path';
import NPAPdf from '@domain/Utils/NPAPdf';
import fs from 'fs';
import GetAllCampaignsDTO from './GetAllCampaignsByIssuerDTO';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import { IOmniBusReport, IOmniBusReportId } from './OmniBusReport/IOmniBusReport';
import GetCampaignsWithRepaymentsDTO from './GetCampaignsWithRepaymentsDTO';
import GetCampaignsWithProjectionReturnsDTO from './GetCampaignsWithProjectionReturnsDTO';

const { google } = Config;

@injectable()
class CampaignService implements ICampaignService {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(ICampaignNewsRepositoryId)
    private campaignNewsRepository: ICampaignNewsRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
    @inject(ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCaseId)
    private sendLikedCampaignExpirationNotifyBeforeThirtyDays: ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase,
    @inject(IPushNotificationServiceId)
    private pushNotificationService: IPushNotificationService,
    @inject(ICampaignHoneycombChargeFeeId)
    private campaignHoneycombChargeFeeRepository: ICampaignHoneycombChargeFeeRepository,
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IDeleteProjectionReturnsId)
    private deleteProjectionReturns: IDeleteProjectionReturns,
    @inject(IOmniBusReportId) private omniBusReport: IOmniBusReport,
  ) {}

  /**
   *
   * @param {GetAllCampaignsDTO} getAllCampaignsDTO
   * @returns Campaign[]
   */
  async getAllCampaignsByIssuer(getAllCampaignsDTO: GetAllCampaignsDTO) {
    const result = await this.campaignRepository.fetchByIssuerId(
      getAllCampaignsDTO.getIssuerId(),
      getAllCampaignsDTO.getPaginationOptions(),
      getAllCampaignsDTO.isShowTrashed(),
    );

    const campaigns = result.getPaginatedData();

    for (const campaign of campaigns.data) {
      const isLiked = campaign.interestedInvestors.find(
        (interestedInvestors) =>
          interestedInvestors.investorId === getAllCampaignsDTO.getInvestorId(),
      );

      delete campaign.interestedInvestors;
      campaign.isFavorite = false;

      if (isLiked) {
        campaign.isFavorite = true;
      }
      const amountInvested = await this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
      );
      campaign.amountInvested = amountInvested;
    }

    return campaigns;
  }

  /**
   *
   * @param {GetFavoriteCampaignDTO} getFavoriteCampaignDTO
   * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: *}, status: string}>}
   */
  async getFavoriteCampaign(getFavoriteCampaignDTO) {
    const result = await this.campaignRepository.getFavoriteCampaign(
      getFavoriteCampaignDTO.getInvestorId(),
      getFavoriteCampaignDTO.getPaginationOptions(),
      getFavoriteCampaignDTO.isShowTrashed(),
    );

    const campaigns = result.getPaginatedData();

    for (const campaign of campaigns.data) {
      const isLiked = campaign.interestedInvestors.find(
        (interestedInvestors) =>
          interestedInvestors.investorId === getFavoriteCampaignDTO.getInvestorId(),
      );

      delete campaign.interestedInvestors;
      campaign.isFavorite = false;

      if (isLiked) {
        campaign.isFavorite = true;
      }
      const amountInvested = await this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
      );
      campaign.amountInvested = amountInvested;
    }

    return campaigns;
  }

  /**
   *
   * @param {UpdateCampaignDTO} updateCampaignDTO
   * @return boolean
   */
  async updateCampaign(updateCampaignDTO: UpdateCampaignDTO) {
    try {
      const campaign = await this.campaignRepository.fetchById(
        updateCampaignDTO.getCampaignId(),
      );

      if (!campaign) {
        throw new HttpException(404, 'campaign not found');
      }

      if (campaign.campaignName !== updateCampaignDTO.getCampaign().campaignName) {
        const checkCampaignNameAvailable = await this.campaignRepository.checkNameAvailbility(
          updateCampaignDTO.getCampaign().campaignName,
        );

        if (checkCampaignNameAvailable) {
          throw new HttpError(400, 'Campaign name already in used');
        }
      }

      if (updateCampaignDTO.getCampaign().isChargeFee !== campaign.isChargeFee) {
        const campaignHoneycombChargeFee = CampaignHoneycombChargeFee.createFromDetail({
          isChargeFee: updateCampaignDTO.getCampaign().isChargeFee,
          campaignId: updateCampaignDTO.getCampaignId(),
        });
        await this.campaignHoneycombChargeFeeRepository.add(campaignHoneycombChargeFee);
      }

      if (
        updateCampaignDTO.getCampaign().campaignStage &&
        campaign.campaignStage !== updateCampaignDTO.getCampaign().campaignStage
      ) {
        const updatedCampaign = updateCampaignDTO.getCampaign();
        updatedCampaign.issuer = campaign.issuer;

        const campaignNotificationService = CampaignNotificationFactory.createFromCampaign(
          updatedCampaign,
        );

        if (campaignNotificationService) {
          campaignNotificationService.execute();
        }
      }

      const campaignSignatureImage = await this.campaignDocumentRepository.fetchByCampaignAndType(
        campaign.campaignId,
        'SignatureImage',
      );

      const signImageObj = updateCampaignDTO.getSignImage();

      let signaturePath: string | null;

      if (campaignSignatureImage !== null && signImageObj) {
        const signObject = {
          campaignDocumentId: campaignSignatureImage.campaignDocumentId,
          campaignId: campaign.campaignId,
          documentType: 'SignatureImage',
          name: signImageObj.originalname,
          path: signImageObj.path,
          mimeType: signImageObj.mimetype,
          ext: signImageObj.originalname[signImageObj.originalname.length - 1],
        };
        const upsertDocument = CampaignDocument.createFromObject(signObject);
        await this.campaignDocumentRepository.update(upsertDocument);
        signaturePath = `https://storage.googleapis.com/${google.BUCKET_NAME}/${upsertDocument.path}`;
      } else if (campaignSignatureImage !== null) {
        signaturePath = `https://storage.googleapis.com/${google.BUCKET_NAME}/${campaignSignatureImage.path}`;
      } else {
        if (signImageObj) {
          const extention =
            signImageObj.originalname[signImageObj.originalname.length - 1];
          const campaignDocument = CampaignDocument.createFromDetail(
            campaign.campaignId,
            'SignatureImage',
            signImageObj.originalname,
            signImageObj.path,
            signImageObj.mimetype,
            extention,
          );
          await this.campaignDocumentRepository.add(campaignDocument);
          signaturePath = `https://storage.googleapis.com/${google.BUCKET_NAME}/${campaignDocument.path}`;
        } else {
          signaturePath = null;
        }
      }
      const documentType = 'Note Purchase Agreement';
      const campaignNPA = await this.campaignDocumentRepository.fetchByCampaignAndType(
        campaign.campaignId,
        documentType,
      );

      if (
        campaign.blanketLien !== updateCampaignDTO.getCampaign().blanketLien ||
        campaign.equipmentLien !== updateCampaignDTO.getCampaign().equipmentLien ||
        campaign.personalGuaranty !== updateCampaignDTO.getCampaign().personalGuaranty ||
        signImageObj !== null ||
        signImageObj !== undefined ||
        signImageObj === 'undefined'
      ) {
        if (
          campaign.investmentType !== 'SAFE' &&
          campaign.investmentType !== 'SAFE - DISCOUNT' &&
          campaign.investmentType !== 'Equity (LLC)'
        ) {
          if (campaignNPA !== null) {
            await this.campaignDocumentRepository.remove(campaignNPA, true);
          }
          await this.updateNPADocument(
            updateCampaignDTO.getCampaign(),
            campaign.issuer,
            signaturePath,
          );
        }
      }

      if (
        updateCampaignDTO.getCampaign().campaignStage === CampaignStage.DEFAULTED ||
        updateCampaignDTO.getCampaign().campaignStage === CampaignStage.IN_INVESTOR_VOTE
      ) {
        await this.deleteProjectionReturns.execute(
          updateCampaignDTO.getCampaign().campaignId,
        );
      }

      // if (
      //   updateCampaignDTO.getCampaign().escrowType === CampaignEscrow.NC_BANK &&
      //   !campaign.ncOfferingId
      // ) {
      //   const ncOfferingId = await northCapitalService.createCampaign(
      //     updateCampaignDTO.getCampaign(),
      //     campaign.issuer,
      //     updateCampaignDTO.getIp(),
      //   );

      //   updateCampaignDTO.getCampaign().ncOfferingId = ncOfferingId;
      // }

      if (updateCampaignDTO.getCampaign().escrowType !== campaign.escrowType) {
        if (
          campaign.campaignStage === CampaignStage.FUNDED ||
          campaign.campaignStage === CampaignStage.FUNDRAISING
        ) {
          throw new HttpException(
            400,
            "Campaign in 'Funded' or 'Fund Raising' stage cannot switch escrow banks.",
          );
        }
      }

      const updateResult = await this.campaignRepository.update(
        updateCampaignDTO.getCampaign(),
      );

      if (!updateResult) {
        throw new HttpException(400, 'campaign update failed');
      }

      if (
        updateCampaignDTO.getCampaign().createdAt >= '2021-11-01 00:00:00' ||
        updateCampaignDTO.getCampaignId() != 'c0b1e45b-2402-4dac-9139-e002035671a5'
      ) {
        if (campaign.OfferingId()) {
          const ncCampaign = {
            ...updateCampaignDTO.getCampaign(),
            ncOfferingId: campaign.ncOfferingId,
          };
          if (updateCampaignDTO.getCampaign().escrowType === CampaignEscrow.NC_BANK) {
            await northCapitalService.updateCampaign(
              ncCampaign,
              campaign.issuer,
              updateCampaignDTO.getIp(),
            );
          }
        }
      }

      if (updateCampaignDTO.getCampaign().campaignStage === CampaignStage.FUNDED) {
        await this.omniBusReport.execute(updateCampaignDTO.getCampaign());
      }

      // if (updateCampaignDTO.getCampaign().campaignStage === CampaignStage.NOT_FUNDED) {
      //   const campaignFunds = await this.campaignFundRepository.fetchByCampaignForRefund(
      //     campaign.campaignId,
      //   );
      //   if (campaignFunds) {
      //     await Promise.all(
      //       campaignFunds.map(async (campaignFund) => {
      //         const input = new FundReturnRequestDTO(
      //           campaignFund.campaignFundId,
      //           'Campaign Not Funded',
      //           '',
      //           '',
      //           'From Admin Panel',
      //         );
      //         await this.fundReturnRequest.execute(input);
      //       }),
      //     );
      //   }
      // }

      return updateResult;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateNPADocument(campaign, issuer, signaturePath) {
    const documentPath = `${campaign.slug}-npa.pdf`;
    await NPAPdf(campaign, issuer, signaturePath, null, documentPath, null);

    const fileName = `campaignDocument-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(documentPath)}`;
    const filepath = `uploads/campaignDocuments/NPA/${campaign.slug}/${fileName}`;
    const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
    await this.storageService.uploadPdfFile(pdfFileStream, filepath);
    const documentType = 'Note Purchase Agreement';
    const documentObject = CampaignDocument.createFromDetail(
      campaign.campaignId,
      documentType,
      fileName,
      filepath,
      'application/pdf',
      'pdf',
    );

    await this.campaignDocumentRepository.add(documentObject);
    fs.unlink(pdfFileStream, (err) => {
      logger.error(err);
    });
  }

  /**
   *
   * @param {RemoveCampaignDTO} removeCampaignDTO
   * @returns boolean
   */
  async removeCampaign(removeCampaignDTO: RemoveCampaignDTO) {
    const campaign = await this.campaignRepository.fetchById(
      removeCampaignDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(404, 'campaign not found');
    }

    const deleteResult = await this.campaignRepository.remove(
      campaign,
      removeCampaignDTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'campaign delete failed');
    }

    return deleteResult;
  }

  async getPublicOppurtunities(getPublicOppurtunitiesDTO) {
    const result = await this.campaignRepository.fetchPublicOppurtunities({
      paginationOptions: getPublicOppurtunitiesDTO.getPaginationOptions(),
      showTrashed: getPublicOppurtunitiesDTO.isShowTrashed(),
      campaignStage: getPublicOppurtunitiesDTO.getCampaignStage(),
    });

    return result.getPaginatedData();
  }

  async determineCampaignStatus(determineCampaignStatusDTO) {
    const campaign = await this.campaignRepository.fetchById(
      determineCampaignStatusDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(400, 'no such campaign');
    }

    return await this.updateCampaignStatus(campaign);
  }

  async CampaignExpiredUpdateStatusHandler() {
    const campaigns = await this.campaignRepository.fetchByExpirationDate(
      moment().format('YYYY-MM-DD'),
      {
        campaignStage: CampaignStage.FUNDRAISING,
      },
    );

    const updateStatusPromises: Array<any> = [];
    for (const campaign of campaigns) {
      updateStatusPromises.push(this.updateCampaignStatus(campaign));
    }

    const results = await Promise.allSettled(updateStatusPromises);

    results
      .filter((result) => result.status === 'rejected')
      .forEach((failedJob) => {
        if ('reason' in failedJob) {
          logger.error(failedJob.reason);
        }
      });

    return true;
  }

  async LikedCampaigNotifyThirtyDayFromNow() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setMonth(thirtyDaysFromNow.getMonth() + 1);

    const campaigns = await this.campaignRepository.fetchByExpirationDate(
      moment(thirtyDaysFromNow).format('YYYY-MM-DD'),
      {
        includeInterestedInvestor: true,
      },
    );

    const pushNotificationPromises: Array<any> = [];
    for (const campaign of campaigns) {
      const users = campaign.interestedInvestors.map((investor) => {
        return investor.user;
      });

      pushNotificationPromises.push(
        this.sendLikedCampaignExpirationNotifyBeforeThirtyDays.execute({
          campaign,
          users,
        }),
      );
    }

    const results = await Promise.allSettled(pushNotificationPromises);
    results
      .filter((result) => result.status === 'rejected')
      .forEach((failedJob) => {
        if ('reason' in failedJob) {
          logger.error(failedJob.reason);
        }
      });

    return true;
  }

  async LikedCampaigNotifyOneDayFromNow() {
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    const campaigns = await this.campaignRepository.fetchByExpirationDate(
      moment(oneDayFromNow).format('YYYY-MM-DD'),
      {
        includeInterestedInvestor: true,
      },
    );

    const pushNotificationPromises: Array<any> = [];
    for (const campaign of campaigns) {
      const users = campaign.interestedInvestors.map((investor) => {
        return investor.user;
      });

      pushNotificationPromises.push(
        this.sendLikedCampaignExpirationNotifyBeforeThirtyDays.execute({
          campaign,
          users,
        }),
      );
    }

    const results = await Promise.allSettled(pushNotificationPromises);
    results
      .filter((result) => result.status === 'rejected')
      .forEach((failedJob) => {
        if ('reason' in failedJob) {
          logger.error(failedJob.reason);
        }
      });

    return true;
  }

  async updateCampaignStatus(campaign) {
    try {
      const campaignFunds = await this.campaignFundRepository.fetchAllByCampaignWithSuccessfulCharges(
        campaign.campaignId,
      );

      const investors = campaignFunds.map((campaignFund) => campaignFund.investorId);

      const isCampaignSuccessful = CampaignStatusService.createFromDetails({
        campaign,
        campaignFunds,
      }).isCampaignSuccessful();

      if (isCampaignSuccessful) {
        if (campaign.campaignStage !== CampaignStage.FUNDED) {
          campaign.campaignStage = CampaignStage.FUNDED;

          await this.campaignRepository.update(campaign);
          await this.pushNotificationService.sendSuccessfulCampaignNotifications(
            campaign,
            investors,
          );
        }

        return true;
      }

      if (campaign.campaignStage !== CampaignStage.NOT_FUNDED) {
        campaign.campaignStage = CampaignStage.NOT_FUNDED;
        await this.campaignRepository.update(campaign);
        await this.pushNotificationService.sendUnSuccessfulCampaignNotifications(
          campaign,
          investors,
        );

        // await CampaignFundService.refundAllCampaignPledges(campaign);
      }

      return true;
    } catch (err) {
      throw new Error(
        `job failed for campaign with id ${campaign.campaignId} with error: ${err}`,
      );
    }
  }

  /**
   *
   * @param {FindCampaignSlugDTO} findCampaignDTO
   * @returns Campaign
   */
  async findCampaignBySlug(findCampaignDTO) {
    let campaign: any = await this.campaignRepository.fetchBySlug(
      findCampaignDTO.getSlug(),
      findCampaignDTO.isAdminRequest(),
    );

    if (!campaign) {
      throw new HttpException(404, 'campaign not found');
    }

    // to public object
    if (!findCampaignDTO.isAdminRequest()) {
      campaign = campaign.toPublicDTO();
      if (campaign.issuer) {
        campaign.issuer = campaign.issuer.toPublicDTO();

        if (campaign.issuer.owners) {
          campaign.issuer.owners = campaign.issuer.owners.map((owner) => {
            owner = owner.toPublicDTO();
            if (owner.user) {
              owner.user = owner.user.toPublicObject();
            }
            return owner;
          });
        }
      }
    }

    if (findCampaignDTO.getInvestorId()) {
      const isFavorite = await this.favoriteCampaignRepository.fetchByInvestorAndCampaign(
        findCampaignDTO.getInvestorId(),
        findCampaignDTO.getCampaignId(),
      );
      campaign.isFavorite = !!isFavorite;
    }

    const [
      sumRegCF,
      sumRegD,
      numInvestors,
      businessUpdatecount,
      campaignQACount,
    ] = await Promise.all([
      this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        InvestorInvestmentType.REG_CF,
        false,
      ),
      this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        InvestorInvestmentType.REG_D,
        false,
      ),
      this.campaignFundRepository.fetchCountByCampaign(
        campaign.campaignId,
        false,
        true,
        false,
      ),
      this.campaignNewsRepository.fetchNewsCountByCampaign(campaign.campaignId),
      this.campaignQARepository.fetchQACountByCampaign(campaign.campaignId),
    ]);

    campaign.regCFFunds = sumRegCF;
    campaign.regDFunds = sumRegD;
    campaign.totalFundsRaised = sumRegCF + sumRegD;
    campaign.numInvestors = numInvestors;
    campaign.businessUpdatecount = businessUpdatecount;
    campaign.campaignQACount = campaignQACount;

    return campaign;
  }

  async getAllFCCampaigns() {
    const data = await this.campaignRepository.getAllFCCampaigns();
    return data;
  }

  async getCampaignsWithRepayments(
    getCampaignsWithRepaymentsDTO: GetCampaignsWithRepaymentsDTO,
  ): Promise<any> {
    return this.campaignRepository.getCampaignsWithRepayments(
      getCampaignsWithRepaymentsDTO.getSearch(),
      getCampaignsWithRepaymentsDTO.getPaginationOptions(),
    );
  }

  async getCampaignsWithProjectionReturns(
    getCampaignsWithProjectionReturnsDTO: GetCampaignsWithProjectionReturnsDTO,
  ): Promise<any> {
    return this.campaignRepository.getCampaignsWithProjectionReturns(
      getCampaignsWithProjectionReturnsDTO.getSearch(),
      getCampaignsWithProjectionReturnsDTO.getPaginationOptions(),
    );
  }
}

export default CampaignService;
