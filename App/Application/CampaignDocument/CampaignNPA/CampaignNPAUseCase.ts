import {
  ICampaignDocumentRepositoryId,
  ICampaignDocumentRepository,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import { ICampaignNPAUseCase } from './ICampaignNPAUseCase';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import { inject, injectable } from 'inversify';
import GetCampaignNPADTO from './GetCampaignNPADTO';
import HttpError from '@infrastructure/Errors/HttpException';
@injectable()
class CampaignNPAUseCase implements ICampaignNPAUseCase {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
  ) {}

  async execute(getCampaignNPADTO: GetCampaignNPADTO): Promise<any> {
    const campaignDocument = await this.campaignDocumentRepository.fetchByCampaignAndType(
      getCampaignNPADTO.getCampaignId(),
      getCampaignNPADTO.getInvestmentType(),
    );

    if (!campaignDocument) {
      throw new HttpError(404, 'Campaign document not found');
    }

    return this.storageService.generateV4ReadSignedUrl(
      campaignDocument.getCampaignDocumentPath(),
    );
  }
}

export default CampaignNPAUseCase;
