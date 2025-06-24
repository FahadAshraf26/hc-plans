import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignHoneycombChargeFee extends BaseEntity {
    campaignHoneycombChargeFeeId: string;
    private isChargeFee: boolean;
    campaignId: string

    constructor({campaignHoneycombChargeFeeId, isChargeFee}) {
        super();
        this.campaignHoneycombChargeFeeId = campaignHoneycombChargeFeeId;
        this.isChargeFee = isChargeFee;
    }

    setCampaignId(campaignId) {
        this.campaignId = campaignId;
    }

    static createFromObj(campaignHoneycombChargeFeeObj) {
        const campaignHoneycombChargeFee = new CampaignHoneycombChargeFee(campaignHoneycombChargeFeeObj);
        if (campaignHoneycombChargeFeeObj.createdAt) {
            campaignHoneycombChargeFee.setCreatedAt(campaignHoneycombChargeFeeObj.createdAt);
        }
        if (campaignHoneycombChargeFeeObj.updatedAt) {
            campaignHoneycombChargeFee.setUpdatedAt(campaignHoneycombChargeFeeObj.updatedAt);
        }
        if (campaignHoneycombChargeFeeObj.deletedAt) {
            campaignHoneycombChargeFee.setDeletedAT(campaignHoneycombChargeFeeObj.deletedAt);
        }

        return campaignHoneycombChargeFee
    }

    static createFromDetail({isChargeFee, campaignId}) {

        const campaignHoneycombChargeFee = new CampaignHoneycombChargeFee({
            campaignHoneycombChargeFeeId: uuid(),
            isChargeFee
        });

        campaignHoneycombChargeFee.setCampaignId(campaignId)
        return campaignHoneycombChargeFee
    }
}

export default CampaignHoneycombChargeFee
