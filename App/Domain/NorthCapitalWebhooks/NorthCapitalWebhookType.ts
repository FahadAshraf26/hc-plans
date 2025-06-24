import InvalidWebhookTypeException from './Exceptions/InvalidNorthCapitalWebhookException';

class NorthCapitalWebhookType {
  private readonly _value: string;

  static webhookType = {
    createTrade: 'Create Trade',
    updateTradeStatus: 'Update Trade Status',
    updateAiVerification: 'Update Ai Verification',
    createParty: 'Create Party',
    createAccount: 'Create Account',
    updateCCFundMoveStatus: 'Update CC Fund Status',
    updateBankFundMoveStatus: 'Update Bank Fund Status',
  };

  constructor(value) {
    this._value = value;
  }

  static isValidWebhookType(value) {
    return Object.values(this.webhookType).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidWebhookType(value)) {
      throw new InvalidWebhookTypeException();
    }

    return new NorthCapitalWebhookType(value);
  }

  value() {
    return this._value;
  }

  static CreateTrade() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.createTrade,
    );
  }

  static UpdateTradeStatus() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.updateTradeStatus,
    );
  }

  static UpdateAiVerification() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.updateAiVerification,
    );
  }

  static CreateParty() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.createParty,
    );
  }

  static CreateAccount() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.createAccount,
    );
  }

  static UpdateCCFundMoveStatus() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.updateCCFundMoveStatus,
    );
  }

  static UpdateBankFundMoveStatus() {
    return NorthCapitalWebhookType.createFromValue(
      NorthCapitalWebhookType.webhookType.updateBankFundMoveStatus,
    );
  }
}

export default NorthCapitalWebhookType;
