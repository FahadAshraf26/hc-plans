import USAEpayWebhook from './USAEpayWebhook';
import USAEpayWebhookType from './USAEpayWebhookType';
import USAEpayWebhookStatus from './USAEpayWebhookStatus';

class USAEpayWebhookMap {
  static toDomain(usaEpayWebhookObj) {
    const usaEpayWebhookType = USAEpayWebhookType.createFromValue(
      usaEpayWebhookObj.webhookType,
    );
    const usaEpayWebhookStatus = USAEpayWebhookStatus.createFromValue(
      usaEpayWebhookObj.status,
    );
    const usaEpayWebhookEntity = USAEpayWebhook.create(
      { ...usaEpayWebhookObj, usaEpayWebhookType, usaEpayWebhookStatus },
      usaEpayWebhookObj.webhookId,
    );

    return usaEpayWebhookEntity;
  }

  static toPersistence(usaEpayWebhookEntity) {
    return {
      webhookId: usaEpayWebhookEntity.webhookId(),
      webhookType: usaEpayWebhookEntity.webhookType(),
      status: usaEpayWebhookEntity.status(),
      payload: usaEpayWebhookEntity.payload(),
    };
  }

  static toDTO(usaEpayWebhookEntity) {
    const obj = {
      webhookId: usaEpayWebhookEntity.webhookId(),
      webhookType: usaEpayWebhookEntity.webhookType(),
      status: usaEpayWebhookEntity.status(),
      payload: usaEpayWebhookEntity.payload(),
    };

    return obj;
  }
}

export default USAEpayWebhookMap;
