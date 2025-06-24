class SendSubscritionDocumentDTO {
    campaignId: string | undefined;

    constructor(
        campaignId = undefined,
    ) {
        this.campaignId = campaignId;
    }

    getcampaignId() {
        return this.campaignId;
    }

  

}

export default SendSubscritionDocumentDTO;
