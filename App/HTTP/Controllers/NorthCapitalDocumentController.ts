import GetAllNorthCapitalDocumentsDTO from '@application/NorthCapitalDocuments/GetAllNorthCapitalDocumentsDTO';
import {
  INorthCapitalDocumentService,
  INorthCapitalDocumentServiceId,
} from '@application/NorthCapitalDocuments/INorthCapitalDocumentService';
import { injectable, inject } from 'inversify';

@injectable()
class NorthCapitalDocument {
  constructor(
    @inject(INorthCapitalDocumentServiceId)
    private northCapitalService: INorthCapitalDocumentService,
  ) {}

  getAllNorthCapitalDocuments = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;
    const input = new GetAllNorthCapitalDocumentsDTO(page, perPage);
    const data = await this.northCapitalService.getAllNorthCapitalDocuments(input);
    return {
      body: {
        data,
      },
    };
  };
}

export default NorthCapitalDocument;
