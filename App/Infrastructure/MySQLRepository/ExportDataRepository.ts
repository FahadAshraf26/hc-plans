import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
import { IExportDataRepository } from '@domain/Core/ExportData/IExportDataRepository';
import Model from '@infrastructure/Model';
import ExportData from '@domain/Core/ExportData/ExportData';
import DatabaseError from '../Errors/DatabaseError';
import PaginationData from '@domain/Utils/PaginationData';

const { ExportDataModel } = Model;

@injectable()
class ExportDataRepository extends BaseRepository implements IExportDataRepository {
  constructor() {
    super(ExportDataModel, 'exportDataId', ExportData);
  }

  async fetchAllExports(paginationOptions: any) {
    try {
      const response = await ExportDataModel.findAndCountAll({
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        order: [['createdAt', 'DESC']],
      });

      const paginationData = new PaginationData(paginationOptions, response.count);
      response.rows.forEach((entityObj) =>
        paginationData.addItem(ExportData.createFromObject(entityObj)),
      );

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}

export default ExportDataRepository;
