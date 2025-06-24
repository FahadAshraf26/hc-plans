import { UseCase } from '@application/BaseInterface/UseCase';
import GetFavoriteCampaignDTO from '@application/User/getFavoriteCampaign/GetFavoriteCampaignDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import FavoriteCampaign from '@domain/Core/FavoriteCampaign/FavoriteCampaign';

export const IGetFavoriteCampaignUseCaseId = Symbol.for('IGetFavoriteCampaignUseCase');
export interface IGetFavoriteCampaignUseCase
  extends UseCase<GetFavoriteCampaignDTO, PaginationDataResponse<FavoriteCampaign>> {}
