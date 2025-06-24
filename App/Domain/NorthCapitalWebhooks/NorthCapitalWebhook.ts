import uuid from 'uuid/v4';
import NorthCapitalWebhookStatus from '@domain/NorthCapitalWebhooks/NorthCapitalWebhookStatus';

class NorthCapitalWebhook {
  private readonly _webhookId: string;
  private _props: any;

  constructor(webhookId: string, props: any) {
    this._webhookId = webhookId;
    this._props = props;
  }

  webhookId() {
    return this._webhookId;
  }

  webhookType() {
    return this._props.webhookType.value();
  }

  payload() {
    return this._props.payload;
  }

  status() {
    return this._props.status.value();
  }

  setStatus(status: NorthCapitalWebhookStatus) {
    this._props.status = status;
  }

  static create(webhookProps?: any, webhookId?: string) {
    if (!webhookId) {
      webhookId = uuid();
    }
    return new NorthCapitalWebhook(webhookId, webhookProps);
  }
}

export default NorthCapitalWebhook;
