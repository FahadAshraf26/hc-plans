import BaseEntity from '../BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class ExportData extends BaseEntity {
  private exportDataId: string;
  private documentType: string;
  private name: string;
  private path: string;
  private mimeType: string;
  private ext: string;
  private requestedBy: string;

  constructor(exportDataId, documentType, name, path, mimeType, ext, requestedBy) {
    super();
    this.exportDataId = exportDataId;
    this.documentType = documentType;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.ext = ext;
    this.requestedBy = requestedBy;
  }

  static createFromObject(exportDataObj): ExportData {
    const exportData = new ExportData(
      exportDataObj.exportDataId,
      exportDataObj.documentType,
      exportDataObj.name,
      exportDataObj.path,
      exportDataObj.mimeType,
      exportDataObj.ext,
      exportDataObj.requestedBy,
    );

    if (exportDataObj.createdAt) {
      exportData.setCreatedAt(exportDataObj.createdAt);
    }

    if (exportDataObj.updatedAt) {
      exportData.setUpdatedAt(exportDataObj.updatedAt);
    }

    if (exportDataObj.deletedAt) {
      exportData.setDeletedAT(exportDataObj.deletedAt);
    }

    return exportData;
  }

  static createFromDetail(
    documentType,
    name,
    path,
    mimeType,
    ext,
    requestedBy,
  ): ExportData {
    return new ExportData(uuid(), documentType, name, path, mimeType, ext, requestedBy);
  }
}

export default ExportData