class CampaignNotFoundException extends Error {
  constructor() {
    super('Campaign Not Found!');
    Error.captureStackTrace(this, CampaignNotFoundException);
    this.name = 'CampaignNotFoundException';
  }
}

export default CampaignNotFoundException;
