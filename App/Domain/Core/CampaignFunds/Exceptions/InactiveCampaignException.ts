import DomainException from '../../Exceptions/DomainException';

class InactiveCampaignException extends DomainException {
  constructor() {
    super('campaignExpired');
    Error.captureStackTrace(this, InactiveCampaignException);
    this.name = 'InactiveCampaignException';
  }
}

export default InactiveCampaignException;
