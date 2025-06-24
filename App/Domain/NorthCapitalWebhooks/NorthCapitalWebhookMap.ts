import NorthCapitalWebhook from './NorthCapitalWebhook';
import NorthCapitalWebhookType from './NorthCapitalWebhookType';
import NorthCapitalWebhookStatus from './NorthCapitalWebhookStatus';

class NorthCapitalWebhookMap {
  static toDomain(northCapitalWebhookObj) {
    const northCapitalWebhookType = NorthCapitalWebhookType.createFromValue(
      northCapitalWebhookObj.webhookType,
    );
    const northCapitalWebhookStatus = NorthCapitalWebhookStatus.createFromValue(
      northCapitalWebhookObj.status,
    );
    const northCapitalWebhookEntity = NorthCapitalWebhook.create(
      { ...northCapitalWebhookObj, northCapitalWebhookType, northCapitalWebhookStatus },
      northCapitalWebhookObj.webhookId,
    );

    return northCapitalWebhookEntity;
  }

  static toPersistence(northCapitalWebhookEntity) {
    return {
      webhookId: northCapitalWebhookEntity.webhookId(),
      webhookType: northCapitalWebhookEntity.webhookType(),
      status: northCapitalWebhookEntity.status(),
      payload: northCapitalWebhookEntity.payload(),
    };
  }

  static toDTO(northCapitalWebhookEntity) {
    const obj = {
      webhookId: northCapitalWebhookEntity.webhookId(),
      webhookType: northCapitalWebhookEntity.webhookType(),
      status: northCapitalWebhookEntity.status(),
      payload: northCapitalWebhookEntity.payload(),
    };

    return obj;
  }
}

export default NorthCapitalWebhookMap;
