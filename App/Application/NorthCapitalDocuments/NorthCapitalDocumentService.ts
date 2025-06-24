import { inject, injectable } from 'inversify';
import { INorthCapitalDocumentService } from './INorthCapitalDocumentService';
import GetAllNorthCapitalDocumentsDTO from './GetAllNorthCapitalDocumentsDTO';
import {
  INorthCapitalDocumentRepository,
  INorthCapitalDocumentRepositoryId,
} from '@domain/Core/NorthCapitalDocument/INorthCapitalDocumentRepository';

@injectable()
class NorthCapitalDocumentService implements INorthCapitalDocumentService {
  constructor(
    @inject(INorthCapitalDocumentRepositoryId)
    private northCapitalDocumentRepository: INorthCapitalDocumentRepository,
  ) {}

  async getAllNorthCapitalDocuments(
    getAllNorthCapitalDocumentsDTO: GetAllNorthCapitalDocumentsDTO,
  ) {
    const result = await this.northCapitalDocumentRepository.fetchAll({
      paginationOptions: getAllNorthCapitalDocumentsDTO.getPaginationOptions(),
    });

    return result.getPaginatedData();
  }
}

export default NorthCapitalDocumentService;
