import { UserEventTypes } from '../../../Domain/Core/ValueObjects/UserEventTypes';
import httpException from '../../../Infrastructure/Errors/HttpException';
import GetUserTosDTO from './GetUserTosDTO';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IToSRepository, IToSRepositoryId } from '@domain/Core/ToS/IToSRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { IGetUserToSUseCase } from '@application/ToS/getUserToS/IGetUserToSUseCase';

@injectable()
class GetUserToS implements IGetUserToSUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IToSRepositoryId) private toSRepository: IToSRepository,
    @inject(IUserEventDaoId) private userEventDAO: IUserEventDao,
  ) {}

  async execute(getUserTosDTO: GetUserTosDTO) {
    const userId = getUserTosDTO.getUserId();
    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new httpException(400, 'no user found against provided input');
    }

    const response = {
      userOnBoarded: !!user.detailSubmittedDate ? true : false,
      TosUpdated: false,
      PrivacyPolicyUpdated: false,
      educationalMaterialUpdated: false,
      faqUpdated: false,
    };

    const tos = await this.toSRepository.fetchTos();

    if (!tos) {
      return response;
    }

    const [
      TosAcknowledgedUpdateDate,
      PrivacyPolicyUpdateAcknowledgedDate,
      EducationMaterialUpdateAcknowledgedDate,
      FAQUpdateAcknowledgedDate,
    ] = await Promise.all([
      this.userEventDAO.fetchLatestByType(UserEventTypes.TOS_UPDATE_ACKNOWLEDGED, {
        userId,
      }),
      this.userEventDAO.fetchLatestByType(
        UserEventTypes.PRIVACY_POLICY_UPDATE_ACKNOWLEDGED,
        {
          userId,
        },
      ),
      this.userEventDAO.fetchLatestByType(
        UserEventTypes.EDUCATION_MATERIAL_UPDATE_ACKNOWLEDGED,
        { userId },
      ),
      this.userEventDAO.fetchLatestByType(UserEventTypes.FAQ_UPDATE_ACKNOWLEDGED, {
        userId,
      }),
    ]);

    response.userOnBoarded =
      !!TosAcknowledgedUpdateDate &&
      !!PrivacyPolicyUpdateAcknowledgedDate &&
      !!EducationMaterialUpdateAcknowledgedDate;

    response.TosUpdated =
      TosAcknowledgedUpdateDate &&
      tos.termOfServicesUpdateDate &&
      new Date(TosAcknowledgedUpdateDate.createdAt) < new Date(tos.createdAt)
        ? true
        : false;

    response.PrivacyPolicyUpdated =
      PrivacyPolicyUpdateAcknowledgedDate &&
      tos.privacyPolicyUpdateDate &&
      new Date(PrivacyPolicyUpdateAcknowledgedDate.createdAt) < new Date(tos.createdAt)
        ? true
        : false;

    response.educationalMaterialUpdated =
      EducationMaterialUpdateAcknowledgedDate &&
      tos.educationalMaterialUpdateDate &&
      new Date(EducationMaterialUpdateAcknowledgedDate.createdAt) <
        new Date(tos.createdAt)
        ? true
        : false;

    if (!FAQUpdateAcknowledgedDate && tos.faqsUpdateDate) {
      response.faqUpdated = true;
    } else {
      response.faqUpdated =
        FAQUpdateAcknowledgedDate &&
        new Date(FAQUpdateAcknowledgedDate.createdAt) < new Date(tos.createdAt)
          ? true
          : false;
    }

    return response;
  }
}

export default GetUserToS;
