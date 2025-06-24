import { injectable } from 'inversify';

import models from '../Model';
import Issue from '../../Domain/Core/Issues/Issue';
import IssueMap from '../../Domain/Core/Issues/IssuerMap';
import DatabaseError from '../Errors/DatabaseError';
import PaginationData from '../../Domain/Utils/PaginationData';
const { IssueModel, Sequelize } = models;
const { Op } = Sequelize;
import { IIssueRepository } from '@domain/Core/Issues/IIssueRepository';

@injectable()
class IssueRepository implements IIssueRepository {
  /**
   *
   * @param {Issue} issueEntity
   * @returns {Promise<boolean>}
   */
  async add(issueEntity: Issue) {
    try {
      const issueObj = IssueMap.toPersistence(issueEntity);
      await IssueModel.create(issueObj);
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  /**
   *
   * @param {PaginationOptions} paginationOptions
   * @returns {Promise<PaginationData>}
   */
  async fetchAll({ paginationOptions }): Promise<PaginationData<any>> {
    try {
      const { rows: all, count } = await IssueModel.findAndCountAll({
        offset: paginationOptions.offset(),
        limit: paginationOptions.limit(),
      });

      const paginationData = new PaginationData(paginationOptions, count);

      all.forEach((issueObj) => {
        paginationData.addItem(IssueMap.toDomain(issueObj));
      });

      return paginationData;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default IssueRepository;
