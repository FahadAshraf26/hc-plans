import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import IssuerDocument from '@domain/Core/IssuerDocument/IssuerDocument';

export const IIssuerDocumentServiceId = Symbol.for('IIssuerDocumentService');
export interface IIssuerDocumentService {
  getIssuerDocuments(
    getIssuerDocumentsDTO,
  ): Promise<PaginationDataResponse<IssuerDocument>>;
  findIssuerDocument(findIssuerDocumentDTO): Promise<IssuerDocument>;
  updateIssuerDocument(updateIssuerDocumentDTO): Promise<boolean>;
  removeIssuerDocument(removeIssuerDocumentDTO): Promise<boolean>;
  createIssuerDocument(createIssuerDocumentDTO): Promise<boolean>;
}
