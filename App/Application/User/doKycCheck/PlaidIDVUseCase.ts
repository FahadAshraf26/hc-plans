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
  import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
  import {
    ISlackService,
    ISlackServiceId,
  } from '@infrastructure/Service/Slack/ISlackService';
  import { inject, injectable } from 'inversify';
  import HttpError from '@infrastructure/Errors/HttpException';
  import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
  import InMemoryAsyncEventBus from '@infrastructure/EventBus/InMemory/InMemoryAsyncEventBus';
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
  import { IPlaidIDVUseCase } from './IPlaidIDVUseCase';
  import { IPlaidServiceId, IPlaidService } from '@infrastructure/Service/Plaid/IPlaidService';
  import { IUpdateUserUseCase, IUpdateUserUseCaseId } from '@application/User/updateUser/IUpdateUserUseCase';
  import UpdateUserUseCaseDTO from '../updateUser/UpdateUserUseCaseDTO';
  
  type KycVerificationResponse = {
    isVerified: boolean;
    status: KycStatus;
  };
  
  @injectable()
  class PlaidIDVUseCase implements IPlaidIDVUseCase {
    constructor(
      @inject(IUserRepositoryId) private readonly userRepository: IUserRepository,
      @inject(ISlackServiceId) private readonly slackService: ISlackService,
      @inject(IHoneycombDwollaConsentServiceId)
      private readonly honeycombConsentService: IHoneycombDwollaConsentService,
      @inject(IHoneycombDwollaCustomerRepositoryId)
      private readonly honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
      @inject(IDwollaServiceId) private readonly dwollaService: IDwollaService,
      @inject(IInvestorPaymentOptionsRepositoryId)
      private readonly investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
      @inject(ICreateNCAccountId) private readonly createNCAccount: ICreateNCAccount,
      @inject(ICreateUSAEPayAccountId) private readonly createUSAEPayAccount: ICreateUSAEPayAccount,
      @inject(ICreateStripeAccountId) private readonly createStripeAccount: ICreateStripeAccount,
      @inject(IPlaidServiceId) private readonly plaidService: IPlaidService,
      @inject(IUpdateUserUseCaseId) private readonly updateUserUseCase: IUpdateUserUseCase,
      private readonly eventbus : InMemoryAsyncEventBus,
    ) { 
      this.eventbus = new InMemoryAsyncEventBus();
    }
  
    private async fetchUser(userId: string): Promise<User> {
      const user = await this.userRepository.fetchById(userId);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }
      return user;
    }
  
    private async notifyVerificationComplete(user: User): Promise<void> {
      try {
        const notificationMessage = `${user.email} completed Plaid IDV verification successfully`;
        await this.slackService.publishMessage({ message: notificationMessage });
      } catch (error) {
        throw new HttpError(500, 'Failed to send notification');
      }
    }
  
    private getVerificationResponse(status: KycStatus): KycVerificationResponse {
      return {
        isVerified: status === KycStatus.PASS,
        status
      };
    }
  
    private async setupPaymentAccounts(user: User): Promise<void> {
      try {
        await Promise.all([
          this.createStripeAccount.createCustomer(user),
          this.createUSAEPayAccount.createFirstCitizenBankCustomer(user),
          this.createUSAEPayAccount.createThreadBankCustomer(user)
        ]);
      } catch (error) {
        throw new HttpError(500, 'Failed to setup payment service accounts');
      }
    }
  
    private async setupDwollaIntegration(user: User): Promise<void> {
      try {
        const userDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
          user.userId
        );
  
        if (!userDwollaCustomer) {
          const input = new CreateHoneycombDwollaPersonalConsentDTO(user.userId);
          await this.honeycombConsentService.createPersonalCustomer(input);
          user.setTos(true);
          await this.addUserBankToDwolla(user);
        }
      } catch (error) {
        throw new HttpError(500, 'Failed to setup Dwolla integration');
      }
    }
  
    private async addUserBankToDwolla(user: User): Promise<void> {
      try {
        const [userBank, userDwollaCustomer] = await Promise.all([
          this.investorPaymentOptionsRepository.fetchInvestorBank(user.investor.investorId),
          this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(user.userId, 'Personal')
        ]);
  
        if (!userBank || !userDwollaCustomer) {
          return;
        }
  
        const bank = userBank.getBank();
        if (!bank.getDwollaFundingSourceId()) {
          const dwollaFundingSourceId = await this.dwollaService.addFundingSource(
            userDwollaCustomer.getDwollaCustomerId(),
            {
              name: `${user.firstName} ${user.lastName}'s ${bank.getAccountType()}`,
              bankAccountType: bank.getAccountType(),
              routingNumber: bank.getRoutingNumber(),
              accountNumber: bank.getAccountNumber(),
              plaidToken: bank.getToken(),
            }
          );
  
          const paymentOption = { ...userBank, dwollaFundingSourceId };
          await this.investorPaymentOptionsRepository.updateBank(paymentOption);
        }
      } catch (error) {
        throw new HttpError(500, 'Failed to setup bank account with Dwolla');
      }
    }
  
    private mapPlaidUser(payload: any) {
      const { name, address, phone_number, date_of_birth, email_address, id_number } = payload;
      const { street, street2, city, region, postal_code, country } = address;
  
      const phone = phone_number ? phone_number.replace(/^\+1/, '').replace(/[^\d]/g, '') : undefined;
  
      return {
        firstName: name.given_name,
        lastName: name.family_name,
        email: email_address,
        dob: date_of_birth,
        phoneNumber: phone,
        address: `${street}${street2 ? ' ' + street2 : ''}`,
        city,
        state: region,
        zipCode: postal_code,
        country,
        ssn: id_number && id_number.type === 'us_ssn' ? id_number.value : undefined,
        isSsnVerified: id_number && id_number.type === 'us_ssn' ? true : false
      };
    }
  
    async execute({ userId, verificationId, requestOrigin, ip }: { userId: string, verificationId: string, requestOrigin: string, ip: string }) {
      const user = await this.fetchUser(userId);
  
      // Return early if already verified
      if (user.isVerified === KycStatus.PASS) {
        return this.getVerificationResponse(KycStatus.PASS);
      }
  
      try {
        const idvResponse = await this.plaidService.getIdentityVerification(verificationId);
  
        if (idvResponse.status === 'success') {
          // Extract user data from the IDV response
          const mappedUser = this.mapPlaidUser(idvResponse.user);
  
          await this.updateUserUseCase.execute(
            new UpdateUserUseCaseDTO(
              userId,
              mappedUser,
              ip,
              requestOrigin
            )
          )
          const updatedUser = await this.fetchUser(userId);
  
          updatedUser.idologyIdNumber = idvResponse.id;
          // Set verification status
          updatedUser.setKycStatus(KycStatus.PASS);
          // Set kyc provider
          updatedUser.setKycProvider('Plaid');
  
          // Setup all integrations
          await this.setupPaymentAccounts(updatedUser);
          await this.setupDwollaIntegration(updatedUser);
  
          // Update user and publish events
          await this.userRepository.update(updatedUser);
          this.eventbus.publish(updatedUser.pullDomainEvents());
  
          // Send notification (non-blocking)
          void this.notifyVerificationComplete(updatedUser);
  
          return this.getVerificationResponse(KycStatus.PASS);
        }
  
        // If verification was not successful
        user.setKycStatus(KycStatus.FAIL);
        user.setKycProvider('Plaid');
        user.idologyIdNumber = idvResponse.id;
        await this.userRepository.update(user);
        return this.getVerificationResponse(KycStatus.FAIL);
  
      } catch (error) {  
        // Revert KYC status on failure
        user.setKycStatus(KycStatus.FAIL);
        user.setTos(false);
        await this.userRepository.update(user);
  
        throw new HttpError(500, 'Identity verification failed');
      }
    }
  }
  
  export default PlaidIDVUseCase; 