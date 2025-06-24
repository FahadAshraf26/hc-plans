import {
  IInitiateAccreditationUseCase,
  IInitiateAccreditationUseCaseId,
} from '@application/User/initiateAccreditation/IInitiateAccreditationUseCase';
import { IUpdateUserUseCase } from '@application/User/updateUser/IUpdateUserUseCase';
import EntityIntermediary from '@domain/Core/EntityIntermediary/EntityIntermediary';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import UserPassword from '@domain/Users/UserPassword';
import config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
// import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import ParseBoolean from '@infrastructure/Utils/ParseBoolean';
import TimeUtil from '@infrastructure/Utils/TimeUtil';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import uuid from 'uuid/v4';
import InitiateAccreditationDTO from '../initiateAccreditation/InitiateAccreditationDTO';
import {
  IDoKycCheckUseCaseId,
  IDokycCHeckUseCase,
} from './../doKycCheck/IDoKycCheckUseCase';
import {
  IAddPersonalVerifiedCustomer,
  IAddPersonalVerifiedCustomerId,
} from './IAddPersonalVerifiedCustomer';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '@application/User/doKycCheck/Utils/ICreateUSAEPayAccount';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '@application/User/doKycCheck/Utils/ICreateStripeAccount';

const { server } = config;

@injectable()
class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInitiateAccreditationUseCaseId)
    private initiateAccreditationUseCase: IInitiateAccreditationUseCase,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository: IEntityIntermediaryRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IAddPersonalVerifiedCustomerId)
    private addPersonalVerifiedCustomer: IAddPersonalVerifiedCustomer,
    @inject(IDoKycCheckUseCaseId) private doKycCheckUseCase: IDokycCHeckUseCase,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
  ) {}

  async fetchUser(dto) {
    const user = await this.userRepository.fetchById(dto.UserId(), true);
    const payload = dto.Payload();
    if (!user) {
      throw new HttpError(400, 'no user found');
    }
    if (payload.ssn) {
      await this.guardAgainstDuplicateSSN(user, payload);
    }

    if (payload.email) {
      await this.guardAgainstDuplicateEmail(user, payload);
      user.updateEmail(payload.email);
    }

    user.setPersonalInformation(payload);
    user.setSocials(payload);

    if (payload.phoneNumber) {
      user.setPhoneNumber(payload.phoneNumber);
    }

    if (payload.password) {
      const userPassword = UserPassword.createFromValue({ value: payload.password });
      user.updatePassword(await userPassword.getHashedValue());
    }

    if (payload.notificationToken) {
      user.setNotificationToken(payload.notificationToken);
    }

    if (payload.profilePic) {
      user.setProfilePic(payload.profilePic);
    }

    if (payload.ssn !== user.ssn) {
      user.setSSN(payload.ssn);
    }

    if (payload.isEmailVerified) {
      const status = payload.isEmailVerified === 'true' ? 'Verified' : '';
      user.setEmailVerificationStatus(status);
    }
    
    if (payload.stripePaymentMethodId) {
      user.stripePaymentMethodId = payload.stripePaymentMethodId;
    }

    if (payload.investor) {
      if (
        !user.investor.getAccreditationStatus() &&
        payload.investor.getAccreditationStatus()
      ) {
        const accreditationDTO = new InitiateAccreditationDTO(user.userId, dto.Ip());

        await this.initiateAccreditationUseCase.execute(accreditationDTO);
      }
      payload.investor.setNorthCapitalAccountId(user.investor.ncAccountId);
      user.setInvestor(payload.investor);
      user.investor.setInvestmentCap(payload.investor.calculateInvestmentCap());
    }

    if (payload.owner) {
      user.setOwner(payload.owner);
    }
    if (payload.isSsnVerified !== undefined) {
      user.setIsSsnVerified(
        payload.isSsnVerified === 'true' || payload.isSsnVerified === true ? true : false,
      );
    }

    if (payload.businessOwner) {
      user.setUserBusinessOwner(ParseBoolean(payload.businessOwner));
    }
    if (user.owner) {
      user.owner.setBusinessOwner(ParseBoolean(payload.businessOwner));
    }
    if (payload.optIn) {
      user.setOptIn(ParseBoolean(payload.optIn));
    }

    const checkUserPersonalInformation =
      user.dob !== payload.dob ||
      user.address !== payload.address ||
      user.ssn !== payload.ssn ||
      user.city !== payload.city ||
      user.state !== payload.state ||
      user.firstName !== payload.firstName ||
      user.lastName !== payload.lastName ||
      user.zipCode !== payload.zipCode;

    if (dto.isAdminRequest()) {
      if (!user.hasOwner && checkUserPersonalInformation) {
        await this.doKycCheckUseCase.execute({
          userId: user.userId,
          forceKyc: false,
          isAdminRequest: false,
          ip: dto.Ip(),
        });
      }
      if (payload.isVerified === KycStatus.PASS) {
        user.setKycStatus(KycStatus.PASS);
        if (!user.stripeCustomerId) {
          await this.createStripeAccount.createCustomer(user);
        }
        if (!user.vcCustomerId) {
          await this.createUSAEPayAccount.createFirstCitizenBankCustomer(user);
        }
        if (!user.vcThreadBankCustomerId) {
          await this.createUSAEPayAccount.createThreadBankCustomer(user);
        }
      }
    }

    return user;
  }

  async guardAgainstDuplicateSSN(user, payload) {
    if (user.ssn === payload.ssn) return;

    const doesUserExist = await this.userRepository.ssnExist({
      ssn: payload.ssn,
      firstName: payload.firstName || user.firstName,
      lastName: payload.lastName || user.lastName,
    });

    if (!server.IS_PRODUCTION || !doesUserExist) {
      return;
    }

    throw new HttpError(400, 'SSN already belongs to a user.');
  }

  async guardAgainstDuplicateEmail(user, payload) {
    if (user.email === payload.email) return;

    const doesUserExist = await this.userRepository.fetchByEmail(payload.email, true);
    if (!doesUserExist) {
      return;
    }

    if (doesUserExist.deletedAt) {
      throw new HttpError(
        403,
        'This account was recently deleted. Please email support@honeycombcredit.com to reactivate this account.',
      );
    }

    throw new HttpError(400, 'This email already has an existing account');
  }

  async updateNcPartyAndAccount(user, dto) {
    const payload = dto.Payload();
    user.dob = payload.dob ? moment.utc(payload.dob).toISOString() : user.dob;
    user.dob = payload.dob ? TimeUtil.getUSDateString(user.dob, 'LL-dd-yyyy') : null;
    if (!user.dob) {
      throw Error(`invalid 'dob' value for user: ${user.email}`);
    }
    // await northCapitalService.updateParty(user.NcPartyId(), user);
    // await northCapitalService.updateAccount(
    //   user.NcAccountId(),
    //   dto.Ip(),
    //   user.getFullName(),
    //   null,
    //   user.KYCstatus,
    // );
    await this.userRepository.update(user);
  }

  async execute(dto) {
    const user = await this.fetchUser(dto);
    const payload = dto.Payload();
    await this.userRepository.update(user);

    if (user.NcPartyId() && user.NcAccountId()) {
      if (
        user.isVerified &&
        user.isVerified !== payload.isVerified &&
        dto.isAdminRequest()
      ) {
        user.setKycStatus(payload.isVerified);
        user['KYCstatus'] =
          payload.isVerified === KycStatus.PASS
            ? 'Manually Approved'
            : payload.isVerified === KycStatus.FAIL
            ? 'Disapproved'
            : payload.isVerified;
      }
      await this.updateNcPartyAndAccount(user, dto);
    }
    // intermediary can only be updated by admin
    // intermediary can only be updated if user KYC is passed.
    const userKyc = user['KYCstatus'] !== 'Disapproved';

    const isIntermediary = ParseBoolean(payload.isIntermediary);
    if (dto.isAdminRequest() && userKyc && isIntermediary) {
      user.setIntermediary(isIntermediary);
      // const intermediaryName = await this.entityIntermediaryRepository.fetchByIntermediaryName(
      //   payload.intermediaryName,
      // );
      // if (intermediaryName) {
      //   throw new HttpError(400, 'Intermediary with this name already exist');
      // }

      await this.entityIntermediaryRepository.upsert(
        {
          entityIntermediaryId: uuid(),
          userId: user.userId,
          operatorAgreementApproved: ParseBoolean(payload.operatorAgreementApproved),
          issuerId: payload.issuerId,
          intermediaryName: payload.intermediaryName,
        },
        {
          userId: user.userId,
        },
      );
    }

    const dwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );

    if (
      (ParseBoolean(payload.tos) &&
        payload.isVerified === KycStatus.PASS &&
        !dwollaCustomer) ||
      (ParseBoolean(payload.tos) && user.isVerified === KycStatus.PASS && !dwollaCustomer)
    ) {
      try {
        await this.addPersonalVerifiedCustomer.execute(payload, user);
      } catch (err) {
        throw new Error(err);
      }
    }

    if (dwollaCustomer && user.isVerified === KycStatus.PASS) {
      user.setTos(ParseBoolean(payload.tos));
      // const input = {
      //   email: user.email,
      //   address1: user.address,
      //   address2: user.apartment,
      //   city: user.city,
      //   state: user.state,
      //   postalCode: user.zipCode,
      //   phone: user.phoneNumber,
      // };

      // await this.dwollaService.updateCustomer(
      //   dwollaCustomer.getDwollaCustomerId(),
      //   input,
      // );

      await this.userRepository.update(user);
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
  async addEntityIntermediary(userId, issuerId, operatorAgreementApproved) {
    const entityIntermediary = EntityIntermediary.createFromDetail()
      .setUserId(userId)
      .setIssuerId(issuerId)
      .setOperatorAgreementApproved(operatorAgreementApproved);
    return this.entityIntermediaryRepository.add(entityIntermediary);
  }
}

export default UpdateUserUseCase;
