import { IRepaymentsUpdateRepository } from '@domain/Core/RepaymentsUpdate/IRepaymentsUpdateRepository';
import Model from '@infrastructure/Model';
import { injectable } from 'inversify';

const { RepaymentsUpdateModel, sequelize } = Model;

@injectable()
class RepaymentsUpdateRepository implements IRepaymentsUpdateRepository {
  constructor() {}

  async fetchLastUpdateDate(): Promise<any> {
    const lastUpdate = await RepaymentsUpdateModel.findAll({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'createdAt']],
    });

    return lastUpdate[0].dataValues.createdAt;
  }

  async add(object) {
      await RepaymentsUpdateModel.create(object);
      return true;
}}

export default RepaymentsUpdateRepository;
