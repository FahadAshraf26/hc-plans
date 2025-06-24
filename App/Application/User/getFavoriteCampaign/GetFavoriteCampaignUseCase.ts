import HttpError from '../../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import { IGetFavoriteCampaignUseCase } from '@application/User/getFavoriteCampaign/IGetFavoriteCampaignUseCase';

@injectable()
class GetFavoriteCampaignUseCase implements IGetFavoriteCampaignUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
  ) {}

  async execute(dto) {
    const user = await this.userRepository.fetchById(dto.getUserId());

    if (!user) {
      throw new HttpError(400, 'no user found againt the given input');
    }

    const { investorId } = user.investor;
    const result = await this.favoriteCampaignRepository.fetchByInvestor(
      investorId,
      dto.getPaginationOptions(),
      dto.isShowTrashed(),
    );

    return result.getPaginatedData();
  }
}

export default GetFavoriteCampaignUseCase;
