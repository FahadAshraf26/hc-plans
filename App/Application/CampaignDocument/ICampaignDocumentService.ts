import GetCampaignDocumentsDTO from '@application/CampaignDocument/GetCampaignDocumentsDTO';
import FindCampaignDocumentDTO from '@application/CampaignDocument/FindCampaignDocumentDTO';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import UpdateCampaignDocumentDTO from '@application/CampaignDocument/UpdateCampaignDocumentDTO';
import RemoveCampaignDocumentDTO from '@application/CampaignDocument/RemoveCampaignDocumentDTO';
import CreateCampaignDocumentDTO from '@application/CampaignDocument/CreateCampaignDocumentDTO';

export const ICampaignDocumentServiceId = Symbol.for('ICampaignDocumentService');

export interface ICampaignDocumentService {
  getCampaignDocuments(
    getCampaignDocumentsDTO: GetCampaignDocumentsDTO,
  ): Promise<Array<CampaignDocument>>;
  findCampaignDocument(
    findCampaignDocumentDTO: FindCampaignDocumentDTO,
  ): Promise<CampaignDocument>;
  updateCampaignDocument(
    updateCampaignDocumentDTO: UpdateCampaignDocumentDTO,
  ): Promise<boolean>;
  removeCampaignDocument(
    removeCampaignDocumentDTO: RemoveCampaignDocumentDTO,
  ): Promise<boolean>;
  createCampaignDocument(
    createCampaignDocumentDTO: CreateCampaignDocumentDTO,
  ): Promise<boolean>;
}
