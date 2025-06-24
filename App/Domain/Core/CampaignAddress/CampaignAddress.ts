import BaseEntity from '../BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class CampaignAddress extends BaseEntity {
  campaignAddressId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  campaignId: string;
  isCampaignAddress: boolean;

  constructor({ campaignAddressId, address, city, state, zipCode, latitude, longitude, campaignId }) {
    super();
    this.campaignAddressId = campaignAddressId;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.latitude = latitude;
    this.longitude = longitude;
    this.campaignId = campaignId;
  }

  setIsCampaignAddress(isCampaignAddress) {
    this.isCampaignAddress = isCampaignAddress;
  }

  static createFromObject(campaignAddressProps) {
    const campaignAddress = new CampaignAddress(campaignAddressProps);
    if (campaignAddressProps.createdAt) {
      campaignAddress.setCreatedAt(campaignAddressProps.createdAt);
    }
    if (campaignAddressProps.updatedAt) {
      campaignAddress.setUpdatedAt(campaignAddressProps.updatedAt);
    }
    if (campaignAddressProps.deletedAt) {
      campaignAddress.setDeletedAT(campaignAddressProps.deletedAt);
    }

    if (campaignAddressProps.campaign) {
      campaignAddress.setIsCampaignAddress(
        campaignAddressProps.campaign.isCampaignAddress,
      );
    }

    return campaignAddress;
  }

  static createFromDetail(campaignAddressProps, campaignId): CampaignAddress {
    return new CampaignAddress({
      campaignAddressId: uuid(),
      ...campaignAddressProps,
      campaignId,
    });
  }
}

export default CampaignAddress;
