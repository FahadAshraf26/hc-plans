import GetUserTosDTO from '@application/ToS/getUserToS/GetUserTosDTO';
import { UseCase } from '@application/BaseInterface/UseCase';
type response = {
  userOnBoarded: boolean;
  TosUpdated: boolean;
  PrivacyPolicyUpdated: boolean;
  educationalMaterialUpdated: boolean;
  faqUpdated: boolean;
};
export const IGetUserToSUseCaseId = Symbol.for('IGetUserToSUseCase');
export interface IGetUserToSUseCase extends UseCase<GetUserTosDTO, response> {}
