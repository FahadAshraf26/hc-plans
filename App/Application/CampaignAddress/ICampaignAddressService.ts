import CampaignAddress from '@domain/Core/CampaignAddress/CampaignAddress';
import CreateCampaignAddressDTO from './CreateCampaignAddressDTO';
import FetchCampaignAddressByCampaignIdDTO from './FetchCampaignAddressByCampaignIdDTO';
import UdpateCampaignAddressDTO from './UpdateCampaignAddressDTO';

export const ICampaignAddressServiceId = Symbol.for('ICampaignAddressService');
export interface ICampaignAddressService {
  addCampaignAddress(createCampaignAddress: CreateCampaignAddressDTO): Promise<boolean>;
  updateCampaignAddress(
    updateCampaignAddress: UdpateCampaignAddressDTO,
  ): Promise<boolean>;
  fetchCampaignAddressByCampaignId(
    fetchCampaignAddressByCampaignId: FetchCampaignAddressByCampaignIdDTO,
  ): Promise<CampaignAddress>;
}
