import GetAllNorthCapitalDocumentsDTO from './GetAllNorthCapitalDocumentsDTO';

export const INorthCapitalDocumentServiceId = Symbol.for('INorthCapitalDocumentService');
export interface INorthCapitalDocumentService {
  getAllNorthCapitalDocuments(
    getAllNorthCapitalDocumentsDTO: GetAllNorthCapitalDocumentsDTO,
  ): Promise<any>;
}
