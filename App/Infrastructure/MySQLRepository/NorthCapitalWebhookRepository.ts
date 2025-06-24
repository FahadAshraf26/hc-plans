import Models from '../Model';
import DatabaseError from '../Errors/DatabaseError';
import NorthCapitalWebhookMap from '@domain/NorthCapitalWebhooks/NorthCapitalWebhookMap';
import { INorthCapitalWebhookRepository } from '@domain/NorthCapitalWebhooks/INorthCapitalWebhookRepository';
import { injectable } from 'inversify';
const { NorthCapitalWebhookModel } = Models;

@injectable()
class NorthCapitalWebhookRepository implements INorthCapitalWebhookRepository {
  async add(northCapitalWebhookEntity) {
    try {
      const northCapitalWebhookObj = NorthCapitalWebhookMap.toPersistence(
        northCapitalWebhookEntity,
      );
      await NorthCapitalWebhookModel.create(northCapitalWebhookObj);
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchById(webhookId) {
    try {
      const northCapitalWebhookObj = await NorthCapitalWebhookModel.findOne({
        where: {
          webhookId,
        },
      });

      if (!northCapitalWebhookObj) {
        return false;
      }

      return NorthCapitalWebhookMap.toDomain(northCapitalWebhookObj);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async update(northCapitalWebhookEntity) {
    try {
      const northCapitalWebhookObj = NorthCapitalWebhookMap.toPersistence(
        northCapitalWebhookEntity,
      );
      await NorthCapitalWebhookModel.update(northCapitalWebhookObj, {
        where: { webhookId: northCapitalWebhookObj.webhookId },
      });
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async remove(northCapitalWebhookEntity) {
    try {
      const northCapitalWebhookObj = NorthCapitalWebhookMap.toPersistence(
        northCapitalWebhookEntity,
      );
      await NorthCapitalWebhookModel.destroy({
        where: { webhookId: northCapitalWebhookObj.webhookId },
      });
      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

export default NorthCapitalWebhookRepository;
