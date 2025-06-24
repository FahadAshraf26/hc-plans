import Models from '../Model';
import DatabaseError from '../Errors/DatabaseError';
import USAEpayWebhookMap from '@domain/USAEpayWebhooks/USAEpayWebhookMap';
import { IUSAEpayWebhookRepository } from '@domain/USAEpayWebhooks/IUSAEpayWebhookRepository';
import { injectable } from 'inversify';
const { UsaEpayWebhookModel } = Models;

@injectable()
class USAEpayWebhookRepository implements IUSAEpayWebhookRepository {
  async add(usaEpayWebhookEntity) {
    try {
      const usaEpayWebhookObj = USAEpayWebhookMap.toPersistence(usaEpayWebhookEntity);
      await UsaEpayWebhookModel.create(usaEpayWebhookObj);
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchById(webhookId) {
    try {
      const usaEpayWebhookObj = await UsaEpayWebhookModel.findOne({
        where: {
          webhookId,
        },
      });

      if (!usaEpayWebhookObj) {
        return false;
      }

      return USAEpayWebhookMap.toDomain(usaEpayWebhookObj);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async update(usaEpayWebhookEntity) {
    try {
      const usaEpayWebhookObj = USAEpayWebhookMap.toPersistence(usaEpayWebhookEntity);
      await UsaEpayWebhookModel.update(usaEpayWebhookObj, {
        where: { webhookId: usaEpayWebhookObj.webhookId },
      });
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async remove(usaEpayWebhookEntity) {
    try {
      const usaEpayWebhookObj = USAEpayWebhookMap.toPersistence(usaEpayWebhookEntity);
      await UsaEpayWebhookModel.destroy({
        where: { webhookId: usaEpayWebhookObj.webhookId },
      });
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

export default USAEpayWebhookRepository;
