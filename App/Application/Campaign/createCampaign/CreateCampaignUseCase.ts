import logger from '@infrastructure/Logger/logger';
import path from 'path';
import CreateCampaignDTO from '@application/Campaign/createCampaign/CreateCampaignDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import GeneralIndustryRisks, {
  replaceBusinessName,
} from '@domain/Utils/GeneralIndustryRisks';
import CampaignRisk from '@domain/Core/CampaignRisk/CampaignRisk';
import {
  ICampaignRiskRepository,
  ICampaignRiskRepositoryId,
} from '@domain/Core/CampaignRisk/ICampaignRiskRepository';
import { ICreateCampaignUseCase } from '@application/Campaign/createCampaign/ICreateCampaignUseCase';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import CampaignNotificationFactory from '../../CampaignNotification/CampaignNotificationFactory';
import {
  ICampaignHoneycombChargeFeeId,
  ICampaignHoneycombChargeFeeRepository,
} from '@domain/Core/CampaignHoneycombChargeFee/ICampaignHoneycombChargeFeeRepository';
import CampaignHoneycombChargeFee from '@domain/Core/CampaignHoneycombChargeFee/CampaignHoneycombChargeFee';
import HttpError from '@infrastructure/Errors/HttpException';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import {
  ICampaignDocumentRepositoryId,
  ICampaignDocumentRepository,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import config from '@infrastructure/Config';
import NPAPdf from '@domain/Utils/NPAPdf';
import fs from 'fs';

const { google } = config;
@injectable()
class CreateCampaignUseCase implements ICreateCampaignUseCase {
  constructor(
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignRiskRepositoryId)
    private campaignRiskRepository: ICampaignRiskRepository,
    @inject(ICampaignHoneycombChargeFeeId)
    private campaignHoneycombChargeFeeRepository: ICampaignHoneycombChargeFeeRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
  ) {}

  /**
   *
   * @param {CreateCampaignDTO} createCampaignDTO
   */
  async execute(createCampaignDTO: CreateCampaignDTO) {
    const issuer = await this.issuerRepository.fetchById(createCampaignDTO.getIssuerId());

    if (!issuer) {
      throw new HttpException(400, 'no issuer found against provided input');
    }

    const campaign = createCampaignDTO.getCampaign();
    const checkCampaignName = await this.campaignRepository.checkNameAvailbility(
      campaign.campaignName,
    );

    if (checkCampaignName) {
      throw new HttpError(400, 'Campaign name already in used');
    }

    const createResult = await this.campaignRepository.add(
      createCampaignDTO.getCampaign(),
    );

    if (!createResult) {
      throw new HttpException(400, 'campaign create failed');
    }

    const campaignHoneycombChargeFee = CampaignHoneycombChargeFee.createFromDetail({
      isChargeFee: campaign.isChargeFee,
      campaignId: campaign.campaignId,
    });

    await this.campaignHoneycombChargeFeeRepository.add(campaignHoneycombChargeFee);
    //create offering on north capital
    if (createCampaignDTO.getCampaign().escrowType === 'NC Bank') {
      const offeringId = await northCapitalService.createCampaign(
        campaign,
        issuer,
        createCampaignDTO.Ip(),
      );
      campaign.setOfferingId(offeringId);
      await this.campaignRepository.update(campaign);
    }

    const campaignNotificationService = CampaignNotificationFactory.createFromCampaign(
      createCampaignDTO.getCampaign(),
    );

    if (campaignNotificationService) {
      campaignNotificationService.execute();
    }

    // create default risks
    const campaignRisks = GeneralIndustryRisks.map((generalRisk) => {
      return CampaignRisk.createFromDetail(
        createCampaignDTO.getCampaign().campaignId,
        generalRisk.riskTitle,
        replaceBusinessName(issuer.IssuerName(), generalRisk.riskDescription),
      );
    });

    await this.campaignRiskRepository.addBulk(campaignRisks);
    let signaturePath: string | null;
    if (createCampaignDTO.getSignImage()) {
      await this.saveSignedImage(campaign.campaignId, createCampaignDTO.getSignImage());
      signaturePath = `https://storage.googleapis.com/${google.BUCKET_NAME}/${
        createCampaignDTO.getSignImage().path
      }`;
    } else {
      signaturePath = null;
    }
    await this.createCampaignNPA(campaign, issuer, signaturePath);

    return createResult;
  }

  async saveSignedImage(campaignId, signImageObj) {
    const extention = signImageObj.originalname[signImageObj.originalname.length - 1];
    const campaignDocument = CampaignDocument.createFromDetail(
      campaignId,
      'SignatureImage',
      signImageObj.originalname,
      signImageObj.path,
      signImageObj.mimetype,
      extention,
    );
    await this.campaignDocumentRepository.add(campaignDocument);
  }

  async createCampaignNPA(campaign, issuer, signaturePath) {
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
    return fs.unlink(pdfFileStream, (err) => {
      logger.error(err);
    });
  }
}

export default CreateCampaignUseCase;