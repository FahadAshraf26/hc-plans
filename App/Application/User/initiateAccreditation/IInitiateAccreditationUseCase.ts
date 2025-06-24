import { UseCase } from '@application/BaseInterface/UseCase';
import InitiateAccreditationDTO from '@application/User/initiateAccreditation/InitiateAccreditationDTO';

export const IInitiateAccreditationUseCaseId = Symbol.for(
  'IInitiateAccreditationUseCase',
);

export interface IInitiateAccreditationUseCase
  extends UseCase<InitiateAccreditationDTO, boolean> {
  saveAccreditationRecord(user): Promise<boolean>;
}
