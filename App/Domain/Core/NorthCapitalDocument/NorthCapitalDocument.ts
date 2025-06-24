import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class NorthCapitalDocument extends BaseEntity {
  ncDocumentId: string;
  private documentType: string;
  private name: string;
  path: string;
  private mimeType: string;
  private ext: string;

  constructor(
    ncDocumentId: string,
    documentType: string,
    name: string,
    path: string,
    mimeType: string,
    ext: string,
  ) {
    super();
    this.ncDocumentId = ncDocumentId;
    this.documentType = documentType;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.ext = ext;
  }

  /**
   *
   * @param {object} ncDocumentObj
   * @returns NorthCapitalDocument
   */
  static createFromObject(ncDocumentObj) {
    const ncDocument = new NorthCapitalDocument(
      ncDocumentObj.ncDocumentId,
      ncDocumentObj.documentType,
      ncDocumentObj.name,
      ncDocumentObj.path,
      ncDocumentObj.mimeType,
      ncDocumentObj.ext,
    );

    if (ncDocumentObj.createdAt) {
      ncDocument.setCreatedAt(ncDocumentObj.createdAt);
    }

    if (ncDocumentObj.updatedAt) {
      ncDocument.setUpdatedAt(ncDocumentObj.updatedAt);
    }

    if (ncDocumentObj.deletedAt) {
      ncDocument.setDeletedAT(ncDocumentObj.deletedAt);
    }

    return ncDocument;
  }

  /**
   *
   * @param {string} documentType
   * @param {string} name
   * @param {string} path
   * @param {string} mimeType
   * @param {string} ext
   * @returns NorthCapitalDocument
   *
   */
  static createFromDetail(documentType, name, path, mimeType, ext) {
    return new NorthCapitalDocument(uuid(), documentType, name, path, mimeType, ext);
  }
}

export default NorthCapitalDocument;
