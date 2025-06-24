import CreateCampaignAddressDTO from '@application/CampaignAddress/CreateCampaignAddressDTO';
import FetchCampaignAddressByCampaignIdDTO from '@application/CampaignAddress/FetchCampaignAddressByCampaignIdDTO';
import {
  ICampaignAddressService,
  ICampaignAddressServiceId,
} from '@application/CampaignAddress/ICampaignAddressService';
import UdpateCampaignAddressDTO from '@application/CampaignAddress/UpdateCampaignAddressDTO';
import { inject, injectable } from 'inversify';

@injectable()
class CampaignAddressController {
  constructor(
    @inject(ICampaignAddressServiceId)
    private campaignAddressService: ICampaignAddressService,
  ) {}

  addCampaignAddress = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const input = new CreateCampaignAddressDTO(campaignId, httpRequest.body);
    await this.campaignAddressService.addCampaignAddress(input);

    return {
      body: {
        status: 'success',
        message: 'Campaign Address Created Successfully!',
      },
    };
  };

  updateCampaignAddress = async (httpRequest) => {
    const { campaignId, campaignAddressId } = httpRequest.params;
    const input = new UdpateCampaignAddressDTO(
      campaignId,
      campaignAddressId,
      httpRequest.body,
    );
    await this.campaignAddressService.updateCampaignAddress(input);
    return {
      body: {
        status: 'success',
        message: 'Campaign Address Updated Successfully!',
      },
    };
  };

  fetchCampaignAddressByCampaignId = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const input = new FetchCampaignAddressByCampaignIdDTO(campaignId);
    const response = await this.campaignAddressService.fetchCampaignAddressByCampaignId(
      input,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default CampaignAddressController;
