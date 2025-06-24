import {
  ICampaignDocumentRepository,
  ICampaignDocumentRepositoryId,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import {
  IUserDocumentRepository,
  IUserDocumentRepositoryId,
} from '@domain/Core/UserDocument/IUserDocumentRepository';
import UserDocument from '@domain/Core/UserDocument/UserDocument';
import NPAPdf from '@domain/Utils/NPAPdf';
import config from '@infrastructure/Config';
import logger from '@infrastructure/Logger/logger';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import fs from 'fs';
import { inject, injectable } from 'inversify';
import path from 'path';
import { ICampaignFundNPA } from './ICampaignFundNPA';
import { IIssuerRepository, IIssuerRepositoryId } from '@domain/Core/Issuer/IIssuerRepository';

const { google } = config;

@injectable()
class CampaignFundNPA implements ICampaignFundNPA {
  constructor(
    @inject(IUserDocumentRepositoryId)
    private userDocumentRepository: IUserDocumentRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
  ) {}

  async execute(dto, user, campaign) {

    if(dto.EntityId()){
      const issuerObj = await this.issuerRepository.fetchById(dto.EntityId());
      const entity = {
        issuerName: issuerObj.issuerName,
        email: issuerObj.getEmail(),
      };

      user.firstName = `${user.firstName} ${user.lastName} for ${entity.issuerName}`;
    } else {
      user.firstName = `${user.firstName} ${user.lastName}`
    }

    const documentType = 'Note Purchase Agreement';
    const campaignNPADocument = await this.campaignDocumentRepository.fetchByCampaignAndType(
      campaign.campaignId,
      documentType,
    );
    const isEquity = campaign.investmentType === 'Equity';
    const isRevenueShare = campaign.investmentType === 'Revenue Share';
    const isConvertibleNote = campaign.investmentType === 'Convertible Note';
      if (campaignNPADocument !== null) {
        await this.saveNPASignedDocument(
          user,
          campaign,
          dto.Amount()._value,
          campaign.issuer,
          isEquity,isRevenueShare,isConvertibleNote
        );
      }
  }

  async saveNPASignedDocument(user, campaign, amount, issuer,isEquity,isRevenueShare,isConvertibleNote) {
    const campaignSignatureImage = await this.campaignDocumentRepository.fetchByCampaignAndType(
      campaign.campaignId,
      'SignatureImage',
    );
    let signaturePath = null;

    if (campaignSignatureImage !== null) {
      signaturePath = `${google.GOOGLE_STORAGE_PATH}${google.BUCKET_NAME}/${campaignSignatureImage.path}`;
    } else {
      signaturePath = null;
    }
    const documentType =
      campaign.investmentType === 'Revenue Share'
        ? 'Revenue Share Note Purchase Agreement'
        : 'Note Purchase Agreement';
    const documentCount = await this.userDocumentRepository.fetchDocumentCount(
      user.userId,
      documentType,
      campaign.campaignId,
    );

    const number = documentCount + 1;
    const documentPath = `Investment-Agreement-${campaign.slug}-${number}-${user.userId}.pdf`;
    const documentName = `Investment-Agreement-${campaign.slug}-${number}.pdf`;
    await NPAPdf(campaign, issuer, signaturePath, amount, documentPath, user,isEquity,isRevenueShare,isConvertibleNote);
    const filepath = `uploads/userDocuments/NPA/${documentPath}`;
    const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
    await this.storageService.uploadPdfFile(pdfFileStream, filepath);
    const userDocument = UserDocument.createFromDetail(
      user.userId,
      documentType,
      documentName,
      filepath,
      'application/pdf',
      'pdf',
      new Date().getFullYear(),
      campaign.campaignId,
    );

    await this.userDocumentRepository.add(userDocument);
    return fs.unlink(pdfFileStream, (err) => {
      logger.error(err);
    });
  }
}

export default CampaignFundNPA;
