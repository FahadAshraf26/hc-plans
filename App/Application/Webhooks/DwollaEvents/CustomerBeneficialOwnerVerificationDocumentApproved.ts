import logger from '../../../Infrastructure/Logger/logger';

class CustomerBeneficialOwnerVerificationDocumentApprovedeededHandler {
  private event: any;

  constructor(event) {
    this.event = event;
  }

  async execute() {
    try {
      return true;
    } catch (error) {
      logger.error(error);

      return false;
    }
  }
}

export default CustomerBeneficialOwnerVerificationDocumentApprovedeededHandler;
