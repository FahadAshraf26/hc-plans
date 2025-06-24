class CampaignExpiredException extends Error {
  constructor() {
    super('campaignExpired');
    Error.captureStackTrace(this, CampaignExpiredException);
    this.name = 'CampaignExpiredException';
  }
}

export default CampaignExpiredException;
