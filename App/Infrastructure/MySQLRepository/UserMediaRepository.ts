import { IUserMediaRepository } from '@domain/Core/UserMedia/IUserMediaRepository';
import models from '../Model';
import UserMedia from '@domain/Core/UserMedia/UserMedia';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import PaginationData from '@domain/Utils/PaginationData';
const { UserMediaModel, UserModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class UserMediaRepository extends BaseRepository implements IUserMediaRepository {
  constructor() {
    super(UserMediaModel, 'userMediaId', UserMedia);
  }

  /**
   * Fetch all userMedias from database with pagination
   * @returns UserMedia[]
   * @param {PaginationOptions} paginationOptions
   * @param {{showTrashed: boolean, querty:string}} options
   */
  async fetchAll(options): Promise<PaginationData<UserMedia>> {
    const { paginationOptions, showTrashed = false, query } = options;

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query
        ? {
            [Op.or]: [
              { type: { [Op.like]: `%${query}%` } },
              { name: { [Op.like]: `%${query}%` } },
            ],
          }
        : {},
      order: [['createdAt', 'desc']],
    });
  }

  /**
   * It will fetch user media by dwolla document Id
   * @param dwollaDocumentId
   * @returns {Promise<Model>}
   */
  async fetchByDwollaDocumentId(dwollaDocumentId): Promise<any> {
    await UserMediaModel.findOne({
      where: {
        dwollaDocumentId,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });
  }
}

export default UserMediaRepository;
