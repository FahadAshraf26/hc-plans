import { IIssuerDocumentRepository } from '@domain/Core/IssuerDocument/IIssuerDocumentRepository';
import models from '../Model';
import IssuerDocument from '@domain/Core/IssuerDocument/IssuerDocument';
import filterUndefined from '../Utils/filterUndefined';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { IssuerDocumentModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class IssuerDocumentRepository extends BaseRepository
  implements IIssuerDocumentRepository {
  constructor() {
    super(IssuerDocumentModel, 'issuerDocumentId', IssuerDocument);
  }

  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * Fetch all questions/Answers for a issuer
   * @param {*} issuerId
   * @param paginationOptions
   * @param options
   */
  async fetchByIssuer(issuerId, paginationOptions, options) {
    try {
      const { showTrashed = false, query } = options;
      const whereConditions = filterUndefined({
        name: query ? { [Op.like]: `%${query}%` } : undefined,
        issuerId: issuerId ? issuerId : undefined,
      });

      return await super.fetchAll({
        whereConditions,
        paginationOptions,
        showTrashed,
      });
    } catch (error) {
      throw Error(error);
    }
  }
}

export default IssuerDocumentRepository;
