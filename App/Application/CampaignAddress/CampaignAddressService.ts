import {
  ICampaignAddressRepository,
  ICampaignAddressRepositoryId,
} from '@domain/Core/CampaignAddress/ICampaignAddressRepository';
import { inject, injectable } from 'inversify';
import { ICampaignAddressService } from './ICampaignAddressService';
import CreateCampaignAddressDTO from './CreateCampaignAddressDTO';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import UdpateCampaignAddressDTO from './UpdateCampaignAddressDTO';
import FetchCampaignAddressByCampaignIdDTO from './FetchCampaignAddressByCampaignIdDTO';
import Model from '@infrastructure/Model';

const { CampaignModel } = Model;

@injectable()
class CampaignAddressService implements ICampaignAddressService {
  constructor(
    @inject(ICampaignAddressRepositoryId)
    private campaignAddressRepository: ICampaignAddressRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
  ) {}

  async addCampaignAddress(createCampaignAddress: CreateCampaignAddressDTO) {
    const campaignId = createCampaignAddress.getCampaignId();
    const isCampaignAddress = createCampaignAddress.getIsCampaignAddress();
    const campaign = await this.campaignRepository.fetchById(campaignId);
    const campaignAddress = createCampaignAddress.getCampaignAddress();
    const campaignUpdatedObject = {
      ...campaign,
      isCampaignAddress,
    };
    await this.campaignRepository.update(campaignUpdatedObject);
    await this.campaignAddressRepository.add(campaignAddress);
    return true;
  }

  async updateCampaignAddress(updateCampaignAddress: UdpateCampaignAddressDTO) {
    const campaignId = updateCampaignAddress.getCampaignId();
    const campaignAddressId = updateCampaignAddress.getCampaignAddressId();
    const campaignAddress = updateCampaignAddress.getCampaignAddress();
    const isCampaignAddress = updateCampaignAddress.getIsCampaignAddress();

    const campaign = await this.campaignRepository.fetchById(campaignId);
    const campaignUpdatedObject = {
      ...campaign,
      isCampaignAddress,
    };

    await this.campaignRepository.update(campaignUpdatedObject);
    await this.campaignAddressRepository.update(campaignAddress, { campaignAddressId });
    return true;
  }

  async fetchCampaignAddressByCampaignId(
    fetchCampaignAddressByCampaignId: FetchCampaignAddressByCampaignIdDTO,
  ) {
    const campaignId = fetchCampaignAddressByCampaignId.getCampaignId();
    const response = await this.campaignAddressRepository.fetchOneByCustomCritera({
      whereConditions: { campaignId },
      includes: [
        { model: CampaignModel, as: 'campaign', attributes: ['isCampaignAddress'] },
      ],
    });

    return response;
  }
}

export default CampaignAddressService;
