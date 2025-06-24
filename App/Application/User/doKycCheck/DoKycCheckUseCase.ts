import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import User from '@domain/Core/User/User';
import {
  IHoneycombDwollaConsentServiceId,
  IHoneycombDwollaConsentService,
} from './../../HoneycombDwollaConsent/IHoneycombDwollaConsentService';
import CreateHoneycombDwollaPersonalConsentDTO from '@application/HoneycombDwollaConsent/CreateHoneycombDwollaPersonalConsentDTO';
import {
  IIdologyTimestampDAO,
  IIdologyTimestampDAOId,
} from '@domain/Core/IdologyTimestamp/IIdologyTimestampDAO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IIdologyService,
  IIdologyServiceId,
} from '@infrastructure/Service/Idology/IIdologyService';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import HttpError from '@infrastructure/Errors/HttpException';
import R from 'ramda';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import IdologyTimestamp from '@domain/Core/IdologyTimestamp/IdologyTimestamp';
import emailTemplates from '@domain/Utils/EmailTemplates';
import mailService from '@infrastructure/Service/MailService';
import InMemoryAsyncEventBus from '@infrastructure/EventBus/InMemory/InMemoryAsyncEventBus';
import { IDokycCHeckUseCase } from './IDoKycCheckUseCase';
// import { UserEventHandler } from '../doKycCheck/Utils/index';
import {
  ICreateNCAccount,
  ICreateNCAccountId,
} from '../doKycCheck/Utils/ICreateNCAccount';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '../doKycCheck/Utils/ICreateUSAEPayAccount';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '../doKycCheck/Utils/ICreateStripeAccount';

const { IdologyScanTemplate } = emailTemplates;
const { SendHtmlEmail } = mailService;

@injectable()
class DoKycCheckUseCase implements IDokycCHeckUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IIdologyServiceId) private idologyService: IIdologyService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IIdologyTimestampDAOId) private idologyTimestampDAO: IIdologyTimestampDAO,
    @inject(IHoneycombDwollaConsentServiceId)
    private honeycombConsentService: IHoneycombDwollaConsentService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(ICreateNCAccountId) private createNCAccount: ICreateNCAccount,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
    private eventbus: InMemoryAsyncEventBus,
  ) {
    this.eventbus = new InMemoryAsyncEventBus();

  }

  async fetchUser(userId) {
    const user = this.userRepository.fetchById(userId);
    if (!user) {
      throw new HttpError(400, 'no user found');
    }
    return user;
  }

  getKycProps = R.pick([
    'firstName',
    'lastName',
    'address',
    'dob',
    'zipCode',
    'state',
    'city',
    'ssn',
  ]);

  validateUserProps = R.compose(R.equals(8), R.length, Object.values, this.getKycProps);

  userVerificationStatus = (user, status) => user.isVerified === status;
  isAlreadyVerified = (user) => this.userVerificationStatus(user, KycStatus.PASS);
  isInManualReview = (user) => this.userVerificationStatus(user, KycStatus.MANUAL_REVIEW);
  isPending = (user) => this.userVerificationStatus(user, KycStatus.PENDING);
  isNotSubmitted = (user) => this.userVerificationStatus(user, KycStatus.NOT_SUBMITTED);
  isSubmitted = (user) => !this.isNotSubmitted(user);

  existingCheckResponse(currentStatus) {
    switch (currentStatus) {
      case KycStatus.PASS:
        return {
          isVerified: true,
          underManualReview: false,
          isEmailSent: false,
        };
      case KycStatus.MANUAL_REVIEW:
        return {
          isVerified: false,
          underManualReview: true,
          isEmailSent: false,
        };
      case KycStatus.PENDING:
        return {
          isVerified: false,
          underManualReview: false,
          isEmailSent: true,
        };
      case KycStatus.FAIL:
        return {
          isVerified: false,
          underManualReview: false,
          isEmailSent: false,
        };
      default:
        throw Error('invalid kyc status. contact support');
    }
  }

  async isPendingVerificationLinkExpired(user) {
    const lastCheck = await this.idologyTimestampDAO.fetchLatestByUser(user.userId);

    if (!lastCheck || !lastCheck.idologyScanUrlExpirationTime) {
      throw new HttpError(400, 'something went wrong, contact support');
    }

    if (new Date() <= new Date(lastCheck.idologyScanUrlExpirationTime)) {
      return false;
    }

    user.isVerified = KycStatus.FAIL;
    lastCheck.isVerified = KycStatus.FAIL;

    await Promise.all([
      this.userRepository.update(user),
      this.idologyTimestampDAO.update(lastCheck),
    ]);

    return true;
  }

  async verifyExistingCheck(user) {
    return (
      this.isAlreadyVerified(user) ||
      this.isInManualReview(user) ||
      (this.isPending(user) &&
        (await this.isPendingVerificationLinkExpired(user)) === false)
    );
  }

  async CheckIfFailedKYCThresholdMet(userId) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const kycCheckCount = await this.idologyTimestampDAO.fetchCountByUser(userId, {
      verificationStats: KycStatus.FAIL,
      fromDate,
    });

    if (kycCheckCount >= 3) {
      throw new HttpError(
        400,
        'Your identity check has failed too many times. kindly contact support to verify your identity',
      );
    }
  }

  async sendPendingCheckEmail(user) {
    //send Email
    const html = IdologyScanTemplate.replace('{@USERNAME}', user.firstName);

    await SendHtmlEmail(user.email, 'Attention Required', html);
  }

  async sendSlackNotification(user, kycStatus) {
    const notificationMessage = `${user.email} attempted kyc, result: ${kycStatus}`;
    await this.slackService.publishMessage({ message: notificationMessage });
    return;
  }

  async initiateKycCheck(user: User, ip, forceKyc = false) {
    const kycLogs = await this.idologyTimestampDAO.fetchCountByUser(user.userId, {
      verificationStats: KycStatus.FAIL,
    });
    if (!user.address) {
      throw new HttpError('400', 'user personal information not present');
    }

    if (user.isVerified === KycStatus.PASS) {
      return { ...this.existingCheckResponse(user.isVerified), status: user.isVerified };
    }

    if (user.isVerified !== KycStatus.PASS && kycLogs >= 1 && !forceKyc) {
      user.setKycStatus(KycStatus.PENDING);
      await this.userRepository.update(user);
      await this.sendPendingCheckEmail(user);
      return { ...this.existingCheckResponse(user.isVerified), status: user.isVerified };
    }

    const response: any = await this.idologyService.validateUser(user);
    const {
      isIdentityMatched,
      idologyIdNumber,
      idologyScanUrl,
      idologyScanUrlExpirationTime,
      isResultMatched,
      badActorFlagged,
    } = response;
    const kycStatusResponse = isIdentityMatched ? KycStatus.PASS : KycStatus.FAIL;
    user.idologyIdNumber = idologyIdNumber;
    user.setKycStatus(kycStatusResponse);
    user.setKycProvider('Idology');
    if (kycStatusResponse === KycStatus.PASS) {
      // const userEventHandler = UserEventHandler(
      //   this.createNCAccount,
      //   this.createUSAEPayAccount,
      //   this.createStripeAccount,
      // );
      await this.createStripeAccount.createCustomer(user);
      await this.createUSAEPayAccount.createFirstCitizenBankCustomer(user);
      await this.createUSAEPayAccount.createThreadBankCustomer(user);
      // userEventHandler.emit('createNCUser', user);
      // userEventHandler.emit('createUSAEpayUser', user);
      // userEventHandler.emit('createStripeUser', user);
      const userDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
        user.userId,
      );
      if (!userDwollaCustomer) {
        const input = new CreateHoneycombDwollaPersonalConsentDTO(user.userId);
        await this.honeycombConsentService.createPersonalCustomer(input);
        user.setTos(true);
        await this.addUserBankToDwolla(user);
      }
    } else {
      user.setTos(false);
    }
    await this.userRepository.update(user);
    const idologyTimeStamp = IdologyTimestamp.createFromDetail(
      user.userId,
      new Date(),
      kycStatusResponse,
      idologyIdNumber,
      idologyScanUrl,
      idologyScanUrlExpirationTime,
      isResultMatched,
      badActorFlagged,
    );
    await this.idologyTimestampDAO.add(idologyTimeStamp);

    this.eventbus.publish(user.pullDomainEvents());
    // await this.sendSlackNotification(user, kycStatus);
    return { ...this.existingCheckResponse(user.isVerified), status: user.isVerified };
  }

  async execute({ userId, forceKyc = false, isAdminRequest = false, ip }) {
    const user = await this.fetchUser(userId);

    if (!this.validateUserProps(user)) {
      throw new HttpError(400, 'missing user information, aborting identity check');
    }

    if (!forceKyc && !isAdminRequest && this.isSubmitted(user) && !user.isRaisegreen) {
      if (await this.verifyExistingCheck(user)) {
        return this.existingCheckResponse(user.isVerified);
      }
    }

    if (!isAdminRequest) {
      await this.CheckIfFailedKYCThresholdMet(userId);
    }

    return this.initiateKycCheck(user, ip, forceKyc);
  }

  async addUserBankToDwolla(user) {
    const userBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      user.investor.investorId,
    );

    const userDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
      user.userId,
      'Persoanl',
    );

    if (userBank) {
      if (userDwollaCustomer) {
        if (!userBank.getBank().getDwollaFundingSourceId()) {
          const dwollaFundingSourceId = await this.dwollaService.addFundingSource(
            userDwollaCustomer.getDwollaCustomerId(),
            {
              name: `${user.firstName} ${
                user.lastName
              }'s ${userBank.getBank().getAccountType()}`,
              bankAccountType: userBank.getBank().getAccountType(),
              routingNumber: userBank.getBank().getRoutingNumber(),
              accountNumber: userBank.getBank().getAccountNumber(),
              plaidToken: userBank.getBank().getToken(),
            },
          );
          const paymentOption = { ...userBank, dwollaFundingSourceId };
          await this.investorPaymentOptionsRepository.updateBank(paymentOption);
        }
      }
    }

    return;
  }
}

export default DoKycCheckUseCase;
