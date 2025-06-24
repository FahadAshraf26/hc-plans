import logger from '@infrastructure/Logger/logger';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { IChargeRepository } from '@domain/Core/Charge/IChargeRepository';

class MassPaymentCompletedHandler {
  private event: any;
  private chargeRepository: IChargeRepository;

  constructor(event: any, chargeRepository: IChargeRepository) {
    this.event = event;
    this.chargeRepository = chargeRepository;
  }

  async execute() {
    try {
      const transferId = this.event.getResourceId();
      const charge = await this.chargeRepository.fetchByDwollaChargeId(transferId);

      if (!charge) {
        return false;
      }

      charge.setChargeStatus(ChargeStatus.SUCCESS);
      await this.chargeRepository.update(charge);

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default MassPaymentCompletedHandler;
