import logger from '../../../Infrastructure/Logger/logger';

class CustomerBeneficialOwnerVerificationDocumentFailedeededHandler {
  private event: any;

  constructor(event: any) {
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

export default CustomerBeneficialOwnerVerificationDocumentFailedeededHandler;
