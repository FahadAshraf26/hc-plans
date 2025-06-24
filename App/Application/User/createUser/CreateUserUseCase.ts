import CreateUserDTO from './CreateUserDTO';
import { EmailVerificationStatus } from '@domain/Core/ValueObjects/EmailVerificationStatus';
import HttpException from '@infrastructure/Errors/HttpException';
import { InvestorAccreditationStatus } from '@domain/Core/ValueObjects/InvestorAccreditationStatus';
import InitiateAccreditationDTO from '../initiateAccreditation/InitiateAccreditationDTO';
import mailService from '@infrastructure/Service/MailService';
import config from '@infrastructure/Config';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import emailTemplates from '@domain/Utils/EmailTemplates';
import { IAuthService, IAuthServiceId } from '@infrastructure/Service/Auth/IAuthService';
import {
  IInitiateAccreditationUseCase,
  IInitiateAccreditationUseCaseId,
} from '../initiateAccreditation/IInitiateAccreditationUseCase';
import {
  ISendEmailVerificationLinkUseCase,
  ISendEmailVerificationLinkUseCaseId,
} from '../sendEmailVerificationLink/ISendEmailVerificationLinkUseCase';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import EntityIntermediary from '@domain/Core/EntityIntermediary/EntityIntermediary';

const { SendHtmlEmail } = mailService;
const { emailConfig, server } = config;
const { aboutMiventureTemplate } = emailTemplates;

@injectable()
class CreateUserUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IAuthServiceId) private authInfrastructureService: IAuthService,
    @inject(IInitiateAccreditationUseCaseId)
    private initiateAccreditationUseCase: IInitiateAccreditationUseCase,
    @inject(ISendEmailVerificationLinkUseCaseId)
    private sendEmailVerificationLinkUseCase: ISendEmailVerificationLinkUseCase,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository: IEntityIntermediaryRepository,
  ) {}

  /**
   *
   * @param {CreateUserDTO} createUserDTO
   * @returns {Promise<Error|{user: User, token: *}>}
   */
  async execute(createUserDTO: CreateUserDTO) {
    await this.guardAgainstDuplicateUser(createUserDTO);
    if (!!createUserDTO.getSSN()) {
      await this.guardAgainstDuplicateSSN(createUserDTO);
    }

    if (createUserDTO.getPassword()) {
      const hashPass = await this.authInfrastructureService.hashPassword(
        createUserDTO.getPassword(),
      );
      createUserDTO.setPassword(hashPass);
    }

    const userInput = createUserDTO.getUser();

    const investmentCap = userInput.investor.calculateInvestmentCap();
    userInput.investor.setInvestmentCap(investmentCap);

    if (userInput.isPersonalInformationSubmitted()) {
      userInput.detailSubmittedDate = new Date();
    }

    if (!createUserDTO.isEmailVerificationRequired()) {
      userInput.isEmailVerified = EmailVerificationStatus.VERIFIED;
    }

    const user = await this.userRepository.add(userInput);

    if (!user) {
      throw new HttpException(400, 'Unable to register a user');
    }
    if (userInput.investor.isAccredited === InvestorAccreditationStatus.ACCREDITED) {
      const dto = new InitiateAccreditationDTO(userInput.userId, createUserDTO.getIP());
      await this.initiateAccreditationUseCase.execute(dto);
    }
    if (createUserDTO.getIntermediary()) {
      await this.addEntityIntermediary(
        createUserDTO.getUserId(),
        createUserDTO.getIssuerId(),
        createUserDTO.getOperatorAgreementApproved(),
        createUserDTO.getIntermediaryName(),
      );
    }

    const token = this.redisAuthService.signJWT(userInput);
    const refreshToken = this.redisAuthService.createRefreshToken();
    userInput.setAccessToken(token, refreshToken);

    await this.redisAuthService.saveAuthenticatedUser(userInput);

    if (createUserDTO.isEmailVerificationRequired()) {
      await this.sendEmailVerificationLinkUseCase.execute({
        user: userInput,
      });
    } else {
      // send about email
      const html = aboutMiventureTemplate
        .replace('{@EMAIL_LINK}', `${emailConfig.MIVENTURE_SUPPORT_EMAIL}`)
        .replace('{@EDUCATION_MATERIAL_LINK}', emailConfig.EDUCATIONAL_MATERIAL_LINK);
      await SendHtmlEmail(
        userInput.email,
        'Thanks for creating a Honeycomb Credit account!',
        html,
      );
    }

    return { user: createUserDTO.getUser(), token, refreshToken };
  }

  /**
   * It will guard against duplicate user
   * @param userDTO
   * @returns {Promise<boolean>}
   */
  async guardAgainstDuplicateUser(userDTO) {
    const userExists = await this.userRepository.fetchByEmail(userDTO.getEmail(), true);
    if (userExists) {
      if (userExists.deletedAt) {
        throw new HttpException(
          403,
          'This account was recently deleted. Please email support@honeycombcredit.com to reactivate this account.',
        );
      }
      throw new HttpException(
        403,
        'The email entered is already being used or is not valid.',
      );
    }
    return true;
  }

  /**
   * It will guard against duplicate ssn
   * @param userDTO
   * @returns {Promise<boolean>}
   */
  async guardAgainstDuplicateSSN(userDTO) {
    const ssnExist = await this.userRepository.ssnExist({
      ssn: userDTO.getSSN(),
      firstName: userDTO.getFirstName(),
      lastName: userDTO.getLastName(),
    });
    if (server.IS_PRODUCTION && ssnExist) {
      throw new HttpException(403, 'SSN already belongs to a user.');
    }
    return true;
  }

  /**
   *
   * @param {string} userId
   * @param {string} issuerId
   * @param {boolean} operatorAgreementApproved
   * @returns {Promise<boolean>}
   */
  async addEntityIntermediary(
    userId,
    issuerId,
    operatorAgreementApproved,
    intermediaryName,
  ) {
    const entityIntermediary = EntityIntermediary.createFromDetail()
      .setUserId(userId)
      .setIssuerId(issuerId)
      .setOperatorAgreementApproved(operatorAgreementApproved)
      .setIntermediaryName(intermediaryName);
    return this.entityIntermediaryRepository.add(entityIntermediary);
  }
}

export default CreateUserUseCase;
