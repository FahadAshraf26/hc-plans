import models from '../Model';
import { injectable } from 'inversify';
import { IUserDocumentRepository } from '@domain/Core/UserDocument/IUserDocumentRepository';
import UserDocument from '@domain/Core/UserDocument/UserDocument';
import filterUndefined from '../Utils/filterUndefined';
import BaseRepository from './BaseRepository';
const { UserDocumentModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class UserDocumentRepository extends BaseRepository implements IUserDocumentRepository {
  constructor() {
    super(UserDocumentModel, 'userDocumentId', UserDocument);
  }

  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({ paginationOptions, showTrashed });
  }

  /**
   * Fetch all questions/Answers for a user
   * @param {*} userId
   * @param paginationOptions
   * @param options
   */
  async fetchByUser(userId, paginationOptions, options) {
    const { showTrashed = false, query, isAdminRequest = false } = options;
    const documentTypes = isAdminRequest ? ['passport', 'license', 'idCard'] :['passport', 'license', 'idCard','Voided Check']
    const whereConditions = filterUndefined({
      name: query ? { [Op.like]: `%${query}%` } : undefined,
      userId: userId ? userId : undefined,
      documentType: {
        [Op.notIn]: documentTypes,
      },
    });

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions,
      order: [['createdAt', 'DESC']],
    });
  }

  async fetchDocumentCount(
    userId: string,
    documentType: string,
    campaignId: string = null,
  ): Promise<any> {
    try {
      return await UserDocumentModel.count({
        where: { userId, documentType, campaignId },
      });
    } catch (err) {
      throw Error(err);
    }
  }
}

export default UserDocumentRepository;
