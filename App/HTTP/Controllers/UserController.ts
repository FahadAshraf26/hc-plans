import CreateUserDTO from '@application/User/createUser/CreateUserDTO';
import UpdateUserProfilePictureDTO from '@application/User/updateUserProfilePicture/UpdateUserProfilePictureDTO';
import GetAllUsersDTO from '@application/User/GetAllUsersDTO';
import InvestmentsDTO from '../../Application/User/InvestmentsDTO';
import GetQADTO from '@application/User/GetQADTO';
import InvestorPortfolioDTO from '../../Application/User/InvestorPortfolioDTO';
import GetInvestorAccreditationDTO from '@application/User/GetInvestorAccreditationDTO';
import GetuserWithKyc from '@application/User/GetUserWithKycDTO';
import InvestorInvestmentLimitAvailabilityDTO from '../../Application/User/InvestorInvestmentLimitAvailabilityDTO';
import GetAllInvestorAccreditationsDTO from '@application/User/GetAllInvestorAccreditationsDTO';
import SaveAcknowledgementsDTO from '@application/User/SaveAcknowledgementsDTO';
import GetUserInfoDTO from '@application/User/getUserInfo/GetUserInfoDTO';
import InitiateAccreditationDTO from '../../Application/User/initiateAccreditation/InitiateAccreditationDTO';
import DeactivateUserDTO from '../../Application/User/deactivateUser/DeactivateUserDTO';
import UpdateUserUseCaseDTO from '@application/User/updateUser/UpdateUserUseCaseDTO';
import { inject, injectable } from 'inversify';
import CreateUserUseCase from '../../Application/User/createUser/CreateUserUseCase';
import GetUserDTO from '../../Application/User/GetUserDTO';
import PlaidIdvRequestUserDTO from '@application/User/PlaidIdvRequestUserDTO';
import GetUserInfoUseCase from '../../Application/User/getUserInfo/GetUserInfoUseCase';
import GetFavoriteCampaignDTO from '../../Application/User/getFavoriteCampaign/GetFavoriteCampaignDTO';
import GetUsersEmailByCategoryDTO from '@application/User/getUsersEmail/getUsersEmailByCategoryDTO';
import CreateUserDocumentDTO from '@application/UserDocument/CreateUserDocumentDTO';
import UpdateUserEmailOrPasswordDTO from '@application/User/UpdateUserEmailOrPasswordDTO';
import UpdateUserUseCase from '@application/User/updateUser/UpdateUserUseCase';
import UserRemainingInvestmentLimitDTO from '@application/User/UserRemainingInvestmentLimitDTO';
import {
  IOptOutOfEmailUseCase,
  IOptOutOfEmailUseCaseId,
} from '@application/User/optOutOfEmail/IOptOutOfEmailUseCase';
import {
  IOptInOfEmailUseCase,
  IOptInOfEmailUseCaseId,
} from '@application/User/optInOfEmail/IOptInOfEmailUseCase';
import {
  IReactivateUserUseCase,
  IReactivateUserUseCaseId,
} from '@application/User/reactivateUser/IReactivateUserUseCase';
import {
  IDeactivateUserUseCase,
  IDeactivateUserUseCaseId,
} from '@application/User/deactivateUser/IDeactivateUserUseCase';
import { IUserService, IUserServiceId } from '@application/User/IUserService';
import {
  IInitiateAccreditationUseCase,
  IInitiateAccreditationUseCaseId,
} from '@application/User/initiateAccreditation/IInitiateAccreditationUseCase';
import {
  IUpdateUserUseCase,
  IUpdateUserUseCaseId,
} from '@application/User/updateUser/IUpdateUserUseCase';
import {
  ISendGlobalNotificationUseCase,
  ISendGlobalNotificationUseCaseId,
} from '@application/User/sendGlobalNotification/ISendGlobalNotificationUseCase';
import {
  ITotalInvestedAmountUseCase,
  ITotalInvestedAmountUseCaseId,
} from '@application/User/getTotalInvestedAmount/ITotalInvestedAmountUseCase';
import {
  IUpdateUserPasswordUseCase,
  IUpdateUserPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdateUserPasswordUseCase';
import {
  IDisablePortfolioVisitedPromptUseCase,
  IDisablePortfolioVisitedPromptUseCaseId,
} from '@application/User/disablePortfolioVisitedPrompt.js/IDisablePortfolioVisitedPromptUseCase';
import {
  IDisableIdVerifiedPromptUseCase,
  IDisableIdVerifiedPromptUseCaseId,
} from '@application/User/disableIdVerifiedPrompt/IDisableIdVerifiedPromptUseCase';
import {
  IDokycCHeckUseCase,
  IDoKycCheckUseCaseId,
} from '@application/User/doKycCheck/IDoKycCheckUseCase';
import {
  ICheckEmailAvaliabilityUseCase,
  ICheckEmailAvaliabilityUseCaseId,
} from '@application/User/checkEmailAvailability/ICheckEmailAvaliabilityUseCase';
import {
  ISubmitFeedbackUseCase,
  ISubmitFeedbackUseCaseId,
} from '@application/User/submitFeedback/ISubmitFeedbackUseCase';
import {
  IGetFavoriteCampaignUseCase,
  IGetFavoriteCampaignUseCaseId,
} from '@application/User/getFavoriteCampaign/IGetFavoriteCampaignUseCase';
import {
  IGetUsersEmailByCategoryUseCase,
  IGetUsersEmailByCategoryUseCaseId,
} from '@application/User/getUsersEmail/IGetUsersEmailByCategoryUseCase';
import {
  ISubmitContactRequestUseCase,
  ISubmitContactRequestUseCaseId,
} from '@application/User/submitContactRequest/ISubmitContactRequestUseCase';
import {
  ISummaryUseCase,
  ISummaryUseCaseId,
} from '@application/User/summary/ISummaryUseCase';
import SummaryDTO from '@application/User/summary/SummaryDTO';
import {
  IUpdateUserProfilePicture,
  IUpdateUserProfilePictureId,
} from '@application/User/updateUserProfilePicture/IUpdateUserProfilePicture';
import {
  IVerifySsnUseCase,
  IVerifySsnUseCaseId,
} from '@application/User/verifySsn/IVerifySsnUseCase';
import {
  IUpdateUserNewPasswordUseCase,
  IUpdateUserNewPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdateUserNewPasswordUseCase';
import {
  IUploadUserIdUseCase,
  IUploadUserIdUseCaseId,
} from '@application/User/uploadUserId/IUploadUserIdUseCase';
import GetAllInvestmentsByInvestorId from '@application/User/GetAllInvestmentsByInvestorIdDTO';
import GetAllInvestmentsByInvestorIdAndEntityDTO from '@application/User/GetAllInvestmentsByInvestorIdAndEntityDTO';
import UpdateUserLastPromptDTO from '@application/User/UpdateUserLastPromptDTO';
import {
  IExportUserDataUseCase,
  IExportUserDataUseCaseId,
} from '@application/User/ExportUser/IExportUserDataUseCase';
import {
  IUploadVoidedCheckUseCase,
  IUploadVoidedCheckUseCaseId,
} from '@application/User/uploadVoidedCheck/IUploadVoidedCheckUseCase';
import ExportEducationalDataDTO from '@application/User/ExportEducationalData/ExportEducationalDataDTO';
import {
  IExportEducationalDataUsecase,
  IExportEducationalDataUsecaseId,
} from '@application/User/ExportEducationalData/IExportEducationalDataUsecase';
import {
  IUpdatePasswordWithCurrentPasswordUseCase,
  IUpdatePasswordWithCurrentPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdatePasswordWithCurrentPasswordUseCase';
import UpdateFcmTokenDTO from '@application/User/UpdateFcmTokenDTO';
import UpdateBiometricInfoDTO from '@application/User/UpdateBiometricInfoDTO';
// import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
// import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IPlaidIDVUseCase, IPlaidIDVUseCaseId } from '@application/User/doKycCheck/IPlaidIDVUseCase';
import { IPlaidService, IPlaidServiceId } from '@infrastructure/Service/Plaid/IPlaidService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    @inject(IUserServiceId) private userService: IUserService,
    private getUserInfoUseCase: GetUserInfoUseCase,
    @inject(IOptOutOfEmailUseCaseId) private optOutOfEmailUseCase: IOptOutOfEmailUseCase,
    @inject(IOptInOfEmailUseCaseId) private optInOfEmailUseCase: IOptInOfEmailUseCase,
    @inject(IReactivateUserUseCaseId)
    private reactivateUserUseCase: IReactivateUserUseCase,
    @inject(IDeactivateUserUseCaseId)
    private deactivateUserUseCase: IDeactivateUserUseCase,
    @inject(IInitiateAccreditationUseCaseId)
    private initiateAccreditationUseCase: IInitiateAccreditationUseCase,
    @inject(IUpdateUserUseCaseId) private updateUserUseCase: IUpdateUserUseCase,
    @inject(ISendGlobalNotificationUseCaseId)
    private sendGlobalNotificationUseCase: ISendGlobalNotificationUseCase,
    @inject(ITotalInvestedAmountUseCaseId)
    private totalInvestedAmountUseCase: ITotalInvestedAmountUseCase,
    @inject(IUpdateUserPasswordUseCaseId)
    private updateUserPasswordUseCase: IUpdateUserPasswordUseCase,
    @inject(IDisablePortfolioVisitedPromptUseCaseId)
    private disablePortfolioVisitedPromptUseCase: IDisablePortfolioVisitedPromptUseCase,
    @inject(IDisableIdVerifiedPromptUseCaseId)
    private DisableIdVerifiedPromptUseCase: IDisableIdVerifiedPromptUseCase,
    @inject(IDoKycCheckUseCaseId) private doKycCheckUseCase: IDokycCHeckUseCase,
    @inject(IPlaidIDVUseCaseId) private plaidIDVUseCase: IPlaidIDVUseCase,
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
    @inject(ICheckEmailAvaliabilityUseCaseId)
    private checkEmailAvailabilityUseCase: ICheckEmailAvaliabilityUseCase,
    @inject(ISubmitFeedbackUseCaseId)
    private submitFeedbackUseCase: ISubmitFeedbackUseCase,
    @inject(IGetFavoriteCampaignUseCaseId)
    private getFavoriteCampaignUseCase: IGetFavoriteCampaignUseCase,
    @inject(IGetUsersEmailByCategoryUseCaseId)
    private getUsersEmailByCategoryUseCase: IGetUsersEmailByCategoryUseCase,
    @inject(ISubmitContactRequestUseCaseId)
    private submitContactRequestUseCase: ISubmitContactRequestUseCase,
    @inject(ISummaryUseCaseId) private summaryUseCase: ISummaryUseCase,
    @inject(IUpdateUserProfilePictureId)
    private updateUserProfilePicture: IUpdateUserProfilePicture,
    @inject(IVerifySsnUseCaseId) private verifySsnUseCase: IVerifySsnUseCase,
    @inject(IUpdateUserNewPasswordUseCaseId)
    private updateUserNewPassword: IUpdateUserNewPasswordUseCase,
    @inject(IUpdatePasswordWithCurrentPasswordUseCaseId)
    private updatePasswordWithCurrentPassword: IUpdatePasswordWithCurrentPasswordUseCase,
    @inject(IUploadUserIdUseCaseId) private uploadUserIdUseCase: IUploadUserIdUseCase,
    @inject(IExportUserDataUseCaseId)
    private exportUserDataUseCase: IExportUserDataUseCase,
    @inject(IUploadVoidedCheckUseCaseId)
    private uploadVoidedCheckUseCase: IUploadVoidedCheckUseCase,
    @inject(IExportEducationalDataUsecaseId)
    private exportEducationDataUsecase: IExportEducationalDataUsecase, // @inject(IDwollaServiceId) private dwollaService: IDwollaService, // @inject(IUserRepositoryId) private userRepository:IUserRepository
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createUser = async (httpRequest) => {
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      address,
      apartment,
      city,
      state,
      zipCode,
      dob,
      phoneNumber,
      facebook,
      linkedIn,
      twitter,
      instagram,
      website,
      investor,
      owner,
      ssn,
      prefix,
      ip = httpRequest.clientIp,
      isOauthSignup,
      shouldVerifySsn,
      isSsnVerified,
      country,
      isIntermediary = false,
      issuerId = null,
      operatorAgreementApproved = false,
      intermediaryName = null,
      signUpType = null,
    } = httpRequest.body;

    const { requestOrigin } = httpRequest.query;

    const createUserDTO = new CreateUserDTO({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      userName,
      address,
      apartment,
      city,
      state,
      zipCode,
      dob,
      phoneNumber,
      facebook,
      linkedIn,
      twitter,
      instagram,
      website,
      investor,
      owner,
      ssn,
      prefix,
      ip,
      requestOrigin,
      isOauthSignup,
      shouldVerifySsn,
      isSsnVerified,
      country,
      isIntermediary,
      issuerId,
      operatorAgreementApproved,
      intermediaryName,
      signUpType,
    });
    if (httpRequest.file) {
      createUserDTO.setProfilePic(httpRequest.file);
    }
    const user = await this.createUserUseCase.execute(createUserDTO);

    return {
      body: {
        status: 'success',
        data: user,
      },
    };
  };
  updateUserEmailOrPassword = async (httpRequest) => {
    const { email, password } = httpRequest.body;
    const { userId } = httpRequest.params;
    const updateUserEmailOrPasswordDTO = new UpdateUserEmailOrPasswordDTO(
      userId,
      email,
      password,
    );
    await this.userService.updateUserEmailOrPassword(updateUserEmailOrPasswordDTO);

    return {
      body: {
        status: 'updated',
        message: 'Email Or Password Updated',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateFcmToken = async (httpRequest) => {
    const { fcmToken } = httpRequest.body;
    const { userId } = httpRequest.params;

    const updateFcmTokenDTO = new UpdateFcmTokenDTO(userId, fcmToken);
    await this.userService.updateFcmToken(updateFcmTokenDTO);

    return {
      body: {
        status: 'updated',
        message: 'Fcm Token Updated',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateBiometricInfo = async (httpRequest) => {
    const { isBiometricEnabled,biometricKey } = httpRequest.body;
    const { userId } = httpRequest.params;

    const updateBiometricInfoDTO = new UpdateBiometricInfoDTO(userId, isBiometricEnabled,biometricKey);
    await this.userService.updateBiometricInfo(updateBiometricInfoDTO);

    return {
      body: {
        status: 'updated',
        message: 'Biometric Info Updated',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  verifyEmail = async (httpRequest) => {
    const { email } = httpRequest.body;

    await this.checkEmailAvailabilityUseCase.execute({ email });

    return {
      body: {
        status: 'success',
        message: 'Valid Email',
      },
    };
  };

  uploadUserId = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const { documentType } = httpRequest.body;
    const dto = [];

    const filesArray = [
      ...httpRequest.files.frontUserIdentity,
      ...httpRequest.files.backUserIdentity,
    ];
    if (httpRequest.files.documentType) {
      filesArray.push(...httpRequest.files.documentType);
    }

    filesArray.forEach((file) => {
      const { filename: name, path, mimetype: mimeType, originalPath } = file;
      const createUserDocumentDTO = new CreateUserDocumentDTO(
        userId,
        documentType,
        name,
        path,
        mimeType,
        'png',
      );
      dto.push(createUserDocumentDTO);
    });

    await this.uploadUserIdUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'User id uploaded successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateProfilePicture = async (httpRequest) => {
    const { body } = httpRequest;
    const { userId } = httpRequest.params;

    const updateUserProfilePictureDTO = new UpdateUserProfilePictureDTO(
      userId,
      body.name,
    );

    if (httpRequest.file) {
      const { filename: name, path, mimetype: mimeType, originalPath } = httpRequest.file;
      updateUserProfilePictureDTO.setProfilePic({
        userId: userId,
        path,
        mimeType,
        name,
        profilePicId: body.profilePicId,
        originalPath,
      });
    }

    await this.updateUserProfilePicture.execute(updateUserProfilePictureDTO);
    return {
      body: {
        status: 'success',
        message: 'user profile image updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateProfile = async (httpRequest) => {
    const { body } = httpRequest;
    const { userId } = httpRequest.params;
    const { requestOrigin } = httpRequest.query;
    const ip = httpRequest.clientIp;

    if (body.profilePic) {
      delete body.profilePic;
    }

    const updateUserProfileDTO = new UpdateUserUseCaseDTO(
      userId,
      body,
      ip,
      requestOrigin,
    );
    if (httpRequest.file) {
      const { filename: name, path, mimetype: mimeType, originalPath } = httpRequest.file;
      updateUserProfileDTO.setProfilePic({
        userId: userId,
        path,
        mimeType,
        name,
        profilePicId: body.profilePicId,
        originalPath,
      });
    }
    if (body.investor) {
      body.investor =
        typeof body.investor === 'string' ? JSON.parse(body.investor) : body.investor;
      body.investor.userId = userId;
      updateUserProfileDTO.setInvestor(body.investor);
    }
    if (body.owner) {
      body.owner = typeof body.owner === 'string' ? JSON.parse(body.owner) : body.owner;
      body.owner.userId = userId;
      updateUserProfileDTO.setOwner(body.owner);
    }

    await this.updateUserUseCase.execute(updateUserProfileDTO);
    // await UserService.updateProfile(updateUserProfileDTO);

    return {
      body: {
        status: 'success',
        message: 'user updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  activateUser = async (httpRequest) => {
    const { userId } = httpRequest.params;

    await this.reactivateUserUseCase.execute({ userId });

    return {
      body: {
        status: 'success',
        message: 'user activated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  optOutOfEmail = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const dto = {
      userId,
    };

    await this.optOutOfEmailUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'user opt out of email successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  optInOfEmail = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const dto = {
      userId,
    };

    await this.optInOfEmailUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'user opt in of email successfully',
      },
    };
  };

  /**
   *
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  sendGlobalNotification = async (httpRequest) => {
    const { type, subject, body, notificationPayload } = httpRequest.body;

    await this.sendGlobalNotificationUseCase.execute({
      type,
      subject,
      body,
      notificationPayload,
    });

    return {
      body: {
        status: 'success',
        message: 'sent global notification to all users successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUser = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const input = new GetUserDTO(userId);
    const user = await this.userService.getUser(input);

    return {
      body: {
        status: 'success',
        data: user,
      },
    };
  };

  getCurrentUser = async (httpRequest) => {
    const { userId } = httpRequest;

    const input = new GetUserDTO(userId);
    const user = await this.userService.getUser(input);

    return {
      body: {
        status: 'success',
        data: user,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllUsers = async (httpRequest) => {
    const { page, perPage, owner, showTrashed, q, ownerQuery } = httpRequest.query;
    const input = new GetAllUsersDTO(page, perPage, showTrashed, owner, q, ownerQuery);
    const users = await this.userService.getAllUsers(input);
    return { body: users };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserWithKyc = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetuserWithKyc(userId, page, perPage, showTrashed);
    const userWithKyc = await this.userService.getUserWithKyc(input);

    return { body: userWithKyc };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  deactivateUser = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const dto = new DeactivateUserDTO(userId, hardDelete);
    await this.deactivateUserUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'user deactivated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  contactUs = async (httpRequest) => {
    const { text } = httpRequest.body;
    const { email } = httpRequest.decoded;

    await this.submitContactRequestUseCase.execute({ email, text });

    return {
      body: {
        status: 'success',
        message: 'Contact request sent successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  feedback = async (httpRequest) => {
    const { text } = httpRequest.body;
    const { email } = httpRequest.decoded;

    await this.submitFeedbackUseCase.execute({ email, text });

    return {
      body: {
        status: 'success',
        message: 'Feedback sent successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  identityCheck = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { forceKYC = false } = httpRequest.body;
    const ip = httpRequest.clientIp;

    return {
      body: {
        status: 'success',
        data: await this.doKycCheckUseCase.execute({
          userId,
          forceKyc: forceKYC,
          isAdminRequest: httpRequest.isAdminRequest,
          ip,
        }),
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
    initiatePlaidIdv = async (httpRequest) => {
      const { userId, verificationId } = httpRequest.params;
      const { requestOrigin } = httpRequest.query;
      const ip = httpRequest.clientIp;
  
      return {
        body: {
          status: 'success',
          data: await this.plaidIDVUseCase.execute({
            userId,
            verificationId,
            requestOrigin,
            ip,
          }),
        },
      };
    };

    createPlaidIdv = async (httpRequest) => {
      const { userId } = httpRequest.params;
      const user = await this.userService.getUser(new GetUserDTO(userId));
      const userDto = new PlaidIdvRequestUserDTO(user);
      const idvResponse = await this.plaidService.createIdentityVerification(userDto.toPlaidUser(),userId);
      
      return {
        body: {
          status: 'success',
          data: idvResponse,
        },
      };
    };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  calculateInvestedAmount = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const result = await this.totalInvestedAmountUseCase.execute({ userId });

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUsersInvestments = async (httpRequest) => {
    const result = await this.userService.getAllUsersInvestments();
    
    return { body: result };
  }


  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserInvestments = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const {
      page,
      perPage,
      showTrashed,
      all = false,
      grouped = true,
      includeFailed = false,
      includeRefunded = false,
      includePending = true,
      requestOrigin,
    } = httpRequest.query;

    const input = new InvestmentsDTO({
      userId,
      page,
      perPage,
      showTrashed,
      grouped,
      includeFailed,
      includeRefunded,
      includePending,
      all,
      requestOrigin,
    });

    const result = await this.userService.getUserInvestments(input);

    return { body: result };
  };

  accumulatedInvestments = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const {
      page,
      perPage,
      all,
      showTrashed,
      grouped = true,
      includeFailed = false,
      includeRefunded = false,
      includePending = true,
    } = httpRequest.query;

    const input = new InvestmentsDTO({
      userId,
      page,
      perPage,
      showTrashed,
      grouped,
      includeFailed,
      includeRefunded,
      includePending,
      entityId: null,
      all,
    });

    const result = await this.userService.getAccumulatedInvestments(input);

    return { body: result };
  };

  getEntityInvestments = async (httpRequest) => {
    const { userId, entityId } = httpRequest.params;
    const {
      page,
      perPage,
      showTrashed,
      grouped = true,
      includeFailed = false,
      includeRefunded = false,
      includePending = true,
      requestOrigin,
    } = httpRequest.query;
    const input = new InvestmentsDTO({
      userId,
      page,
      perPage,
      showTrashed,
      grouped,
      includeFailed,
      includeRefunded,
      includePending,
      entityId,
      requestOrigin,
    });
    const result = await this.userService.getUserInvestments(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserQA = async (httpRequest) => {
    const { userId, page, perPage, showTrashed } = httpRequest.params;
    const input = new GetQADTO(userId, page, perPage, showTrashed);
    const result = await this.userService.getUserQA(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  investorPortfolio = async (httpRequest) => {
    const { userId, entityId = null } = httpRequest.params;

    const input = new InvestorPortfolioDTO(userId, entityId);
    const result = await this.userService.investorPortfolio(input);

    return {
      body: {
        message: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  investorAccreditation = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const input = new GetInvestorAccreditationDTO(userId);
    const result = await this.userService.getInvestorAccreditation(input);

    return {
      body: {
        message: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  investorInvestmentLimitAvailability = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const input = new InvestorInvestmentLimitAvailabilityDTO(userId);
    const date = await this.userService.investorInvestmentLimitAvailability(input);

    return {
      body: {
        status: 'success',
        data: date,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updatePassword = async (httpRequest) => {
    const { password } = httpRequest.body;
    const { userId } = httpRequest.decoded;
    const ip = httpRequest.clientIp;

    await this.updateUserPasswordUseCase.execute({ userId, password, ip });

    return {
      body: {
        status: 'success',
        message: 'user updated successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserFavoriteCampaign = async (httpRequest) => {
    const { userId, page, perPage, showTrashed } = httpRequest.params;
    const input = new GetFavoriteCampaignDTO(userId, page, perPage, showTrashed);
    const result = await this.getFavoriteCampaignUseCase.execute(input);
    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  allInvestorAccreditations = async (httpRequest) => {
    const { userId, page, perPage, wherePendingResult, showTrashed } = httpRequest.params;

    const input = new GetAllInvestorAccreditationsDTO(
      userId,
      page,
      perPage,
      wherePendingResult,
      showTrashed,
    );
    const result = await this.userService.getAllInvestorAccreditations(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  saveAcknowledgements = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { acknowledgements } = httpRequest.body;

    const input = new SaveAcknowledgementsDTO(userId, acknowledgements);
    await this.userService.saveAcknowledgements(input);

    return {
      body: {
        status: 'success',
        message: 'user acknowledgements recorded successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserInfo = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { showTrashed = false } = httpRequest.query;
    const input = new GetUserInfoDTO(userId, showTrashed);
    const user = await this.getUserInfoUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data: user,
      },
    };
  };

  /**
   * It will deactivate user prompt for ID verification done after scanned document
   * @param httpRequest
   * @returns {Promise<{body: {status: string, message: string}}>}
   */
  deactivateIdVerifyPrompt = async (httpRequest) => {
    const { userId } = httpRequest.params;

    await this.DisableIdVerifiedPromptUseCase.execute({ userId });

    return {
      body: {
        status: 'success',
        message: 'ID verified prompt deactivated successfully',
      },
    };
  };

  /**
   * It will deactivate potfolio visited prompt
   * @param httpRequest
   * @returns {Promise<{body: {status: string, message: string}}>}
   */
  deactivatePortfolioVisitedPrompt = async (httpRequest) => {
    const { userId } = httpRequest.params;

    await this.disablePortfolioVisitedPromptUseCase.execute({ userId });

    return {
      body: {
        status: 'success',
        message: 'User portfolio visited successfully',
      },
    };
  };

  /**
   * returns email of users
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUsersEmail = async (httpRequest) => {
    const { usersType, startDate, endDate } = httpRequest.query;

    const dto = new GetUsersEmailByCategoryDTO(usersType, startDate, endDate);

    const data = await this.getUsersEmailByCategoryUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * returns summary of users
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getSummary = async (httpRequest) => {
    const { startDate, endDate } = httpRequest.query;

    const dto = new SummaryDTO(startDate, endDate);
    const results = await this.summaryUseCase.execute(dto);
    const data = Object.assign({}, ...results);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * returns summary of users
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  initiateAccreditation = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const clientIp = httpRequest.clientIp;

    const dto = new InitiateAccreditationDTO(userId, clientIp);
    await this.initiateAccreditationUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'accreditation initiated successfully!',
      },
    };
  };

  verifySsn = async (httpRequest) => {
    const { userId, ssn } = httpRequest.body;
    const result = await this.verifySsnUseCase.execute({ userId, ssn });
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  updateNewPassword = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const { password } = httpRequest.body;
    const ip = httpRequest.clientIp;

    const data = await this.updateUserNewPassword.execute({ userId, password, ip });

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  setNewPasswordWithCurrentPassword = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const { password, currentPassword } = httpRequest.body;
    const ip = httpRequest.clientIp;

    const data = await this.updatePasswordWithCurrentPassword.execute({
      userId,
      password,
      currentPassword,
      ip,
    });

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getAllInvestorInvestments = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const input = new GetAllInvestmentsByInvestorId(userId);
    const data = await this.userService.getInvestmentsByInvestorId(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getAllInvestorAndEntityInvestments = async (httpRequest) => {
    const { userId, entityId } = httpRequest.params;
    const input = new GetAllInvestmentsByInvestorIdAndEntityDTO(userId, entityId);
    const data = await this.userService.getInvestmentsByInvestorIdAndEntity(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
  getUserRemainingInvestmentLimit = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const input = new UserRemainingInvestmentLimitDTO(userId);
    const result = await this.userService.getUserRemainingInvestmentLimit(input);

    return {
      body: {
        status: 'success',
        remainingLimit: result,
      },
    };
  };

  getUserInvestmentPerAnum = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const result = await this.userService.getUserInvestmentPerAnum(userId);
    return {
      body: {
        status: 'success',
        investmentPerAnum: result,
      },
    };
  };

  updateUserLastPromtValue = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { lastPrompt } = httpRequest.body;
    const input = new UpdateUserLastPromptDTO(userId, lastPrompt);
    const result = await this.userService.updateUserLastPromtValue(input);
    return {
      body: {
        status: 'success',
      },
    };
  };

  getUserDataExport = async (httpRequest) => {
    await this.exportUserDataUseCase.execute(httpRequest.adminUser);
    return {
      body: {
        status: 'success',
        message: 'We received your request. You will be notified when file generated!',
      },
    };
  };

  updaloadVoidedCheck = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const { documentType } = httpRequest.body;

    const { path, mimetype: mimeType, originalPath } = httpRequest.file;
    let name = `Voided Check-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    let createUserDocumentDTO = new CreateUserDocumentDTO(
      userId,
      documentType,
      name,
      path,
      mimeType,
      'png',
    );

    await this.uploadVoidedCheckUseCase.execute(createUserDocumentDTO);

    return {
      body: {
        status: 'success',
        message: 'Voided check uploaded successfully',
      },
    };
  };

  // updatePersonalCustome = async (httpRequest) => {
  //   const {
  //     email,
  //     dwollaCustomerId
  //   } = httpRequest.body;

  //   const user = await this.userRepository.fetchByEmail(email, false);
  //   const input = await this.dwollaService.createCustomerInput(user, false);

  //   await this.dwollaService.updateCustomer(
  //     dwollaCustomerId,
  //     input
  //   );

  //   return {
  //     body: {
  //       status: 'success',
  //       message:'dwolla personal customer updated'
  //     }
  //   }
  // }

  exportEducationMaterialData = async (httpRequest) => {
    const { startDate, endDate } = httpRequest.query;
    const input = new ExportEducationalDataDTO(startDate, endDate);
    await this.exportEducationDataUsecase.execute(input);
    return {
      body: {
        status: 'success',
        message: 'We received your request. You will be notified when file generated!',
      },
    };
  };

  resetKycStatus = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const updatedUser = await this.userService.resetKycStatus(userId);

    return {
      body: {
        status: 'success',
        message: 'KYC status reset successfully',
        data: updatedUser
      },
    };
  };
}

export default UserController;
