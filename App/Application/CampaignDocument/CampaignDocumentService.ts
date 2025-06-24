import GetCampaignDocumentsDTO from '../../Application/CampaignDocument/GetCampaignDocumentsDTO';
import FindCampaignDocumentDTO from '../../Application/CampaignDocument/FindCampaignDocumentDTO';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import UpdateCampaignDocumentDTO from '../../Application/CampaignDocument/UpdateCampaignDocumentDTO';
import RemoveCampaignDocumentDTO from '../../Application/CampaignDocument/RemoveCampaignDocumentDTO';
import CreateCampaignDocumentDTO from '../../Application/CampaignDocument/CreateCampaignDocumentDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignDocumentRepository,
  ICampaignDocumentRepositoryId,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import HttpException from '../../Infrastructure/Errors/HttpException';
import { unlink, exists } from 'fs';
import { promisify } from 'util';
const DeleteFile = promisify(unlink);
const FileExists = promisify(exists);

@injectable()
class CampaignDocumentService {
  constructor(
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
  ) {}
  /**z
   * get all campaign documents for a campaign
   * @param {object} getCampaignDocumentsDTO
   * @returns CampaignDocuments[]
   */
  async getCampaignDocuments(
    getCampaignDocumentsDTO: GetCampaignDocumentsDTO,
  ): Promise<any> {
    const result = await this.campaignDocumentRepository.fetchByCampaign(
      getCampaignDocumentsDTO.getCampaignId(),
      getCampaignDocumentsDTO.getPaginationOptions(),
      {
        showTrashed: getCampaignDocumentsDTO.isShowTrashed(),
        query: getCampaignDocumentsDTO.getQuery(),
      },
    );

    return result.getPaginatedData();
  }

  /**
   * find a specific campaign document for a campaign
   * @param {object} findCampaignDocumentDTO
   * @returns CampaignDocument
   */
  async findCampaignDocument(
    findCampaignDocumentDTO: FindCampaignDocumentDTO,
  ): Promise<CampaignDocument> {
    const campaingDocument = await this.campaignDocumentRepository.fetchById(
      findCampaignDocumentDTO.getCampaignDocumentId(),
    );

    if (!campaingDocument) {
      throw new HttpException(
        404,
        'no campaign document record found against the provided input',
      );
    }

    return campaingDocument;
  }

  /**
   * update a campaign document
   * @param {object} updateCampaignDocumentDTO
   * @returns boolean
   */
  async updateCampaignDocument(
    updateCampaignDocumentDTO: UpdateCampaignDocumentDTO,
  ): Promise<boolean> {
    const campaingDocument = await this.campaignDocumentRepository.fetchById(
      updateCampaignDocumentDTO.getCampaignDocumentId(),
    );

    if (!campaingDocument) {
      throw new HttpException(
        404,
        'no campaign document record found against the provided input',
      );
    }

    // if new file uploaded , delete old
    if (campaingDocument.path !== updateCampaignDocumentDTO.getCampaignDocument().path) {
      const fileExists = await FileExists(campaingDocument.path);
      if (fileExists) {
        await DeleteFile(campaingDocument.path);
      }
    }

    const updateResult = await this.campaignDocumentRepository.update(
      updateCampaignDocumentDTO.getCampaignDocument(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'camaping document update failed');
    }

    return updateResult;
  }

  /**
   * delete a campaign document
   * @param {object} removeCampaignDocumentDTO
   * @returns boolean
   */
  async removeCampaignDocument(
    removeCampaignDocumentDTO: RemoveCampaignDocumentDTO,
  ): Promise<boolean> {
    const campaingDocument = await this.campaignDocumentRepository.fetchById(
      removeCampaignDocumentDTO.getCampaignDocumentId(),
    );

    if (!campaingDocument) {
      throw new HttpException(
        404,
        'no campaign document record found against the provided input',
      );
    }

    const deleteResult = await this.campaignDocumentRepository.remove(
      campaingDocument,
      removeCampaignDocumentDTO.shouldHardDelete(),
    );
    if (removeCampaignDocumentDTO.shouldHardDelete() && campaingDocument.ext !== 'url') {
      const fileExists = await FileExists(campaingDocument.path);
      if (fileExists) {
        await DeleteFile(campaingDocument.path);
      }
    }

    if (!deleteResult) {
      throw new HttpException(400, 'campaign document delete failed');
    }

    return deleteResult;
  }

  /**
   * create a campaign document
   * @param {object} createCampaignDocumentDTO
   * @returns boolean
   */
  async createCampaignDocument(
    createCampaignDocumentDTO: CreateCampaignDocumentDTO,
  ): Promise<boolean> {
    const createResult = await this.campaignDocumentRepository.add(
      createCampaignDocumentDTO.getCampaignDocument(),
    );

    if (!createResult) {
      throw new HttpException(400, 'campaign document create failed');
    }

    return createResult;
  }
}

export default CampaignDocumentService;
