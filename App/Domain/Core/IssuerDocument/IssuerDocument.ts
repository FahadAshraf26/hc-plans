import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import Issuer from '@domain/Core/Issuer/Issuer';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';

class IssuerDocument extends BaseEntity {
  private readonly issuerDocumentId: string;
  private readonly issuerId: string;
  private readonly documentType: string;
  private readonly name: string;
  private readonly path: string;
  private readonly mimeType: string;
  private readonly ext: string;
  private issuer: Issuer;
  constructor(issuerDocumentId, issuerId, documentType, name, path, mimeType, ext) {
    super();
    this.issuerDocumentId = issuerDocumentId;
    this.issuerId = issuerId;
    this.documentType = documentType;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.ext = ext;
  }

  /**
   *
   * @param {Issuer} issuer
   */
  setIssuer(issuer: Issuer) {
    this.issuer = issuer;
  }

  /**
   *
   * @param {object} issuerDocumentObj
   * @returns IssuerDocument
   */
  static createFromObject(issuerDocumentObj): IssuerDocument {
    const issuerDocument = new IssuerDocument(
      issuerDocumentObj.issuerDocumentId,
      issuerDocumentObj.issuerId,
      issuerDocumentObj.documentType,
      issuerDocumentObj.name,
      issuerDocumentObj.path,
      issuerDocumentObj.mimeType,
      issuerDocumentObj.ext,
    );

    if (issuerDocumentObj.issuer) {
      issuerDocument.setIssuer(issuerDocumentObj.issuer);
    }

    if (issuerDocumentObj.createdAt) {
      issuerDocument.setCreatedAt(issuerDocumentObj.createdAt);
    }

    if (issuerDocumentObj.updatedAt) {
      issuerDocument.setUpdatedAt(issuerDocumentObj.updatedAt);
    }

    if (issuerDocumentObj.deletedAt) {
      issuerDocument.setDeletedAT(issuerDocumentObj.deletedAt);
    }

    return issuerDocument;
  }

  /**
   *
   * @param {string} issuerId
   * @param {string} documentType
   * @param {string} name
   * @param {string} path
   * @param {string} mimeType
   * @param {string} ext
   * @returns IssuerDocument
   *
   */
  static createFromDetail(
    issuerId,
    documentType,
    name,
    path,
    mimeType,
    ext,
  ): IssuerDocument {
    return new IssuerDocument(uuid(), issuerId, documentType, name, path, mimeType, ext);
  }
}

export default IssuerDocument;
