import { UseCase } from '@application/BaseInterface/UseCase';

type checkEmailAvaliabilityDTOType = {
  email: string;
};

export const ICheckEmailAvaliabilityUseCaseId = Symbol.for(
  'ICheckEmailAvaliabilityUseCase',
);

export interface ICheckEmailAvaliabilityUseCase
  extends UseCase<checkEmailAvaliabilityDTOType, boolean> {}
