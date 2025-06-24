import models from '../Model';
import DwollaWebhook from '../../Domain/Core/DwollaWebhook';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import { IDwollaWebhookDAO } from '@domain/Core/IDwollaWebhookDAO';
const { DwollaWebhookModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class DwollaWebhookDAO extends BaseRepository implements IDwollaWebhookDAO {
  constructor() {
    super(DwollaWebhookModel, 'dwollaWebhookId', DwollaWebhook);
  }

  /**
   * Fetch all dwollaWebhooks from database with pagination
   * @returns DwollaWebhook[]
   * @param options
   */
  async fetchAll(options) {
    const { paginationOptions, showTrashed = false, query, dwollaCustomerId } = options;
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: {
        topic: { [Op.like]: `%${query}%` },
        resourceId: dwollaCustomerId,
      },
    });
  }

  async fetchAllByDate(date) {
    const all = await DwollaWebhookModel.findAll({
      where: {
        createdAt: {
          [Op.gt]: date,
        },
      },
    });

    return all.map((dwollaWebhookObj) => {
      return DwollaWebhook.createFromObject(dwollaWebhookObj);
    });
  }

  async fetchByResourceId(resourceId: string) {
    const resourceResponse = await DwollaWebhookModel.findOne({
      where: { resourceId },
    });

    if (!resourceResponse) {
      return null;
    }

    return DwollaWebhook.createFromObject(resourceResponse);
  }

  async fetchAllByResourceId(resourceId: string) {
    const resourceResponse = await DwollaWebhookModel.findAll({
      where: { resourceId },
    });

    if (!resourceResponse) {
      return null;
    }

    return resourceResponse.map((dwollaWebhookObj) => {
      return DwollaWebhook.createFromObject(dwollaWebhookObj);
    });
  }

  async fetchLatestRecordByResourceId(resourceId: string) {
    const customerLog = await DwollaWebhookModel.findOne({
      where: {
        resourceId,
      },
    });

    return DwollaWebhook.createFromObject(customerLog);
  }

  async fetchByEventId(eventId: string) {
    const customerLog = await DwollaWebhookModel.findOne({
      where: {
        eventId,
      },
    });

    if (!customerLog) {
      return null;
    }

    return DwollaWebhook.createFromObject(customerLog);
  }
}

export default DwollaWebhookDAO;
