import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IIssuerDocumentService } from '@application/IssuerDocument/IIssuerDocumentService';
import {
  IIssuerDocumentRepository,
  IIssuerDocumentRepositoryId,
} from '@domain/Core/IssuerDocument/IIssuerDocumentRepository';
import {
  IUserMediaRepository,
  IUserMediaRepositoryId,
} from '@domain/Core/UserMedia/IUserMediaRepository';
import { unlink, exists } from 'fs';
import { promisify } from 'util';
const DeleteFile = promisify(unlink);
const FileExists = promisify(exists);

@injectable()
class IssuerDocumentService implements IIssuerDocumentService {
  constructor(
    @inject(IIssuerDocumentRepositoryId)
    private issuerDocumentRepository: IIssuerDocumentRepository,
  ) {}
  /**
   * get all issuer documents for a issuer
   * @param {object} getIssuerDocumentsDTO
   * @returns IssuerDocuments[]
   */
  async getIssuerDocuments(getIssuerDocumentsDTO) {
    const result = await this.issuerDocumentRepository.fetchByIssuer(
      getIssuerDocumentsDTO.getIssuerId(),
      getIssuerDocumentsDTO.getPaginationOptions(),
      {
        showTrashed: getIssuerDocumentsDTO.isShowTrashed(),
        query: getIssuerDocumentsDTO.getQuery(),
      },
    );

    return result.getPaginatedData();
  }

  /**
   * find a specific issuer document for a issuer
   * @param {object} findIssuerDocumentDTO
   * @returns IssuerDocument
   */
  async findIssuerDocument(findIssuerDocumentDTO) {
    const issuerDocument = await this.issuerDocumentRepository.fetchById(
      findIssuerDocumentDTO.getIssuerDocumentId(),
    );

    if (!issuerDocument) {
      throw new HttpException(
        404,
        'no issuer document record found against the provided input',
      );
    }

    return issuerDocument;
  }

  /**
   * update a issuer document
   * @param {object} updateIssuerDocumentDTO
   * @returns boolean
   */
  async updateIssuerDocument(updateIssuerDocumentDTO) {
    const issuerDocument = await this.issuerDocumentRepository.fetchById(
      updateIssuerDocumentDTO.getIssuerDocumentId(),
    );

    if (!issuerDocument) {
      throw new HttpException(
        404,
        'no issuer document record found against the provided input',
      );
    }

    // if new file uploaded , delete old
    if (issuerDocument.path !== updateIssuerDocumentDTO.getIssuerDocument().path) {
      const fileExists = await FileExists(issuerDocument.path);
      if (fileExists) {
        await DeleteFile(issuerDocument.path);
      }
    }

    const updateResult = await this.issuerDocumentRepository.update(
      updateIssuerDocumentDTO.getIssuerDocument(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'issuer document update failed');
    }

    return updateResult;
  }

  /**
   * delete a issuer document
   * @param {object} removeIssuerDocumentDTO
   * @returns boolean
   */
  async removeIssuerDocument(removeIssuerDocumentDTO) {
    const issuerDocument = await this.issuerDocumentRepository.fetchById(
      removeIssuerDocumentDTO.getIssuerDocumentId(),
    );

    if (!issuerDocument) {
      throw new HttpException(
        404,
        'no issuer document record found against the provided input',
      );
    }

    const deleteResult = await this.issuerDocumentRepository.remove(
      issuerDocument,
      removeIssuerDocumentDTO.shouldHardDelete(),
    );
    if (removeIssuerDocumentDTO.shouldHardDelete()) {
      const fileExists = await FileExists(issuerDocument.path);
      if (fileExists) {
        await DeleteFile(issuerDocument.path);
      }
    }

    if (!deleteResult) {
      throw new HttpException(400, 'issuer document delete failed');
    }

    return deleteResult;
  }

  /**
   * create a issuer document
   * @param {object} createIssuerDocumentDTO
   * @returns boolean
   */
  async createIssuerDocument(createIssuerDocumentDTO) {
    const createResult = await this.issuerDocumentRepository.add(
      createIssuerDocumentDTO.getIssuerDocument(),
    );

    if (!createResult) {
      throw new HttpException(400, 'issuer document create failed');
    }

    return createResult;
  }
}

export default IssuerDocumentService;
