import crypto from 'crypto';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import { IWebhookService } from '@application/Webhooks/IWebhookService';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignEscrowBankRepository,
  ICampaignEscrowBankRepositoryId,
} from '@domain/Core/CampaignEscrowBank/ICampaignEscrowBankRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IDwollaPostBankTransactionsRepository,
  IDwollaPostBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import {
  IDwollaPostTransactionsRepository,
  IDwollaPostTransactionsRepositoryId,
} from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import {
  IDwollaPreTransactionsRepository,
  IDwollaPreTransactionsRepositoryId,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import {
  IDwollaToBankTransactionsRepository,
  IDwollaToBankTransactionsRepositoryId,
} from '@domain/Core/DwollaToBankTransactions/IDwollaToBankTransactionsRepository';
import DwollaWebhook from '@domain/Core/DwollaWebhook';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IIdologyTimestampDAO,
  IIdologyTimestampDAOId,
} from '@domain/Core/IdologyTimestamp/IIdologyTimestampDAO';
import { IDwollaWebhookDAO, IDwollaWebhookDAOId } from '@domain/Core/IDwollaWebhookDAO';
import {
  IInvestorAccreditationDAO,
  IInvestorAccreditationDAOId,
} from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IRepaymentsRepository,
  IRepaymentsRepositoryId,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IUserMediaRepository,
  IUserMediaRepositoryId,
} from '@domain/Core/UserMedia/IUserMediaRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { InvestorAccreditationStatus } from '@domain/Core/ValueObjects/InvestorAccreditationStatus';
import { InvestReadyVerificationStatus } from '@domain/Core/ValueObjects/InvestReadyVerificationStatus';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import {
  IInvestorBankDAO,
  IInvestorBankDAOId,
} from '@domain/InvestorPaymentOptions/IInvestorBankDAO';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import {
  IInMemoryAsyncEventBus,
  IInMemoryAsyncEventBusId,
} from '@infrastructure/EventBus/InMemory/IInMemoryAsyncEventBus';
import {
  IIdologyService,
  IIdologyServiceId,
} from '@infrastructure/Service/Idology/IIdologyService';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import {
  IInvestReadyService,
  IInvestReadyServiceId,
} from '@infrastructure/Service/InvestReadyService/IInvestReadyService';
import mailService from '@infrastructure/Service/MailService';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import DwollaEventHandlerFactory from './DwollaEvents/DwollaEventHandleFactory';
import GetAllWebhookResponsesDTO from './GetAllWebhookResponsesDTO';
import {
  IAsanaService,
  IAsanaServiceId,
} from '@infrastructure/Service/Asana/IAsanaService';
import { IAsanaWebhook, IAsanaWebhookId } from './AsanaWebhook/IAsanaWebhook';
import {
  IDwollaCustodyTransactionsRepository,
  IDwollaCustodyTransactionsRepositoryId,
} from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import DwollaCustodyTransferHistory from '@domain/Core/DwollaCustodyTransferHistory/DwollaCustodyTransferHistory';
import {
  IDwollaCustodyTransferHistoryRepository,
  IDwollaCustodyTransferHistoryRepositoryId,
} from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';

const { SendHtmlEmail } = mailService;
const {
  accreditationFailedTemplate,
  IdologyManualReviewTemplate,
  IdolodyScanApprovedTemplate,
  userDocumentFailedTemplate,
} = EmailTemplates;
const { emailConfig: EmailConfig, asanaConfig } = config;

@injectable()
class WebhookService implements IWebhookService {
  constructor(
    @inject(IDwollaWebhookDAOId) private dwollaWebhookDAO: IDwollaWebhookDAO,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IIdologyTimestampDAOId) private idologyTimestampDAO: IIdologyTimestampDAO,
    @inject(IInvestorAccreditationDAOId)
    private investorAccreditationDAO: IInvestorAccreditationDAO,
    @inject(IIdologyServiceId) private idologyService: IIdologyService,
    @inject(IPushNotificationServiceId)
    private pushNotificationService: IPushNotificationService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IInMemoryAsyncEventBusId) private eventBus: IInMemoryAsyncEventBus,
    @inject(IInvestReadyServiceId) private investReadyService: IInvestReadyService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IIssuerRepositoryId) private issuerRepository?: IIssuerRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository?: IIssuerBankRepository,
    @inject(IInvestorBankDAOId) private investorBankDAO?: IInvestorBankDAO,
    @inject(IChargeRepositoryId) private chargeRepository?: IChargeRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository?: ICampaignFundRepository,
    @inject(ICampaignEscrowBankRepositoryId)
    private campaignEscrowBankRepository?: ICampaignEscrowBankRepository,
    @inject(IUserMediaRepositoryId) private userMediaRepository?: IUserMediaRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository?: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaToBankTransactionsRepositoryId)
    private dwollaToBankTransactionsRepository?: IDwollaToBankTransactionsRepository,
    @inject(IRepaymentsRepositoryId) private repaymentsRepository?: IRepaymentsRepository,
    @inject(IDwollaPostTransactionsRepositoryId)
    private dwollaPostTransactionsRepository?: IDwollaPostTransactionsRepository,
    @inject(IDwollaPostBankTransactionsRepositoryId)
    private dwollaPostBankTransactionsRepository?: IDwollaPostBankTransactionsRepository,
    @inject(IDwollaPreTransactionsRepositoryId)
    private dwollaPreTransactionRepository?: IDwollaPreTransactionsRepository,
    @inject(ICampaignRepositoryId) private campaignRepository?: ICampaignRepository,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository?: IEntityIntermediaryRepository,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionsHistoryRepository?: ITransactionsHistoryRepository,
    @inject(IAsanaServiceId)
    private asanaService?: IAsanaService,
    @inject(IAsanaWebhookId)
    private asanaWebhook?: IAsanaWebhook,
    @inject(IDwollaCustodyTransactionsRepositoryId)
    private dwollaCustodyTransactionsRepository?: IDwollaCustodyTransactionsRepository,
    @inject(IDwollaCustodyTransferHistoryRepositoryId)
    private dwollaCustodyTransferHistoryRepository?: IDwollaCustodyTransferHistoryRepository,
  ) {}

  async handleDwollaWebhook(dwollaWebhookDTO) {
    const event = dwollaWebhookDTO.getEvent();
    const alreadySavedEvent = await this.dwollaWebhookDAO.fetchByEventId(event.eventId);

    if (alreadySavedEvent !== null) {
      return;
    }
    // if (
    //   event.topic === 'transfer_created' ||
    //   event.topic === 'transfer_completed' ||
    //   event.topic === 'transfer_failed' ||
    //   event.topic === 'transfer_cancelled'
    // ) {
    //   // Extract the transfer ID from the event
    //   const resourceUrl = event._links?.resource?.href;
    //   const transferId = resourceUrl ? resourceUrl.split('/').pop() : null;

    //   if (transferId) {
    //     await this.handleDwollaTransferUpdate(
    //       transferId,
    //       event.topic,
    //       resourceUrl,
    //       event._embedded?.resource?.failure?.code,
    //       event._embedded?.resource?.failure?.description,
    //     );
    //   }
    // }
    // await this.dwollaWebhookDAO.add(event);

    const handler = DwollaEventHandlerFactory.createHandlerFromTopic(
      event,
      this.honeycombDwollCustomerRepository,
      this.userRepository,
      this.issuerRepository,
      this.dwollaService,
      this.issuerBankRepository,
      this.investorBankDAO,
      this.chargeRepository,
      this.campaignEscrowBankRepository,
      this.userMediaRepository,
      this.dwollaToBankTransactionsRepository,
      this.repaymentsRepository,
      this.dwollaPostTransactionsRepository,
      this.dwollaPostBankTransactionsRepository,
      this.dwollaPreTransactionRepository,
      this.campaignRepository,
      this.entityIntermediaryRepository,
      this.transactionsHistoryRepository,
    );

    if (!handler) {
      event.setStatus(ChargeStatus.SUCCESS);
      await this.dwollaWebhookDAO.update(event);
      return false;
    }

    const result = await handler.execute();
    if (result) {
      event.setStatus(ChargeStatus.SUCCESS);
    }

    await this.dwollaWebhookDAO.update(event);

    return;
  }

  async handleDwollaTransferUpdate(
    transferId: string,
    status: string,
    resourceUrl?: string,
    failureCode?: string,
    failureDescription?: string,
  ): Promise<void> {
    const custodyTransaction = await this.dwollaCustodyTransactionsRepository.fetchByTransferId(
      transferId,
    );

    if (!custodyTransaction) {
      console.log(`No custody transaction found with transfer ID: ${transferId}`);
      return;
    }

    const statusMap = {
      transfer_created: 'pending',
      transfer_pending: 'pending',
      transfer_cancelled: 'cancelled',
      transfer_failed: 'failed',
      transfer_processed: 'processing',
      transfer_completed: 'completed',
      bank_transfer_created: 'pending',
      bank_transfer_failed: 'failed',
      bank_transfer_completed: 'completed',
    };

    const mappedStatus = statusMap[status] || 'unknown';

    const isCompleted = mappedStatus === 'completed';

    if (isCompleted) {
      custodyTransaction.setCompletedStatus(mappedStatus);
      custodyTransaction.setIsCompleted(true);
    } else {
      custodyTransaction.setNotCompletedStatus(mappedStatus);
      custodyTransaction.setIsCompleted(false);
    }

    if (failureCode || failureDescription) {
      custodyTransaction.setFailureCode(failureCode);
      custodyTransaction.setFailureReason(failureDescription);
    }

    await this.dwollaCustodyTransactionsRepository.update(custodyTransaction);

    if (isCompleted) {
      const dwollaCustodyTransferHistory = DwollaCustodyTransferHistory.createFromDetail({
        source: custodyTransaction.getSource(),
        destination: custodyTransaction.getDestination(),
        dwollaTransferId: transferId,
        businessOwnerName: custodyTransaction.getBusinessOwnerName(),
        businessOwnerEmail: custodyTransaction.getBusinessOwnerEmail(),
        amount: custodyTransaction.getAmount(),
        issuerId: custodyTransaction.getIssuerId(),
      });

      await this.dwollaCustodyTransferHistoryRepository.add(dwollaCustodyTransferHistory);
    }
  }

  async getUnhandledEvents(dateToFilterBy, reProcess) {
    // dateToFilterBy.setDate(dateToFilterBy - 1);

    const dwollaEvents = await this.dwollaService.getEventsSinceDate(dateToFilterBy);

    if (reProcess) {
      return dwollaEvents || [];
    }

    const dwollaWebhooks = await this.dwollaWebhookDAO.fetchAllByDate(dateToFilterBy);

    if (dwollaEvents && dwollaEvents.length === 0) {
      return [];
    }

    return dwollaEvents.filter((event) => {
      return dwollaWebhooks.findIndex((webhook) => webhook.eventId === event.id) === -1;
    });
  }

  async retryDwollaWebhooks(date = new Date(), reProcess = false) {
    const unhandledEvents = await this.getUnhandledEvents(date, reProcess);

    for (const { id, resourceId, topic } of unhandledEvents) {
      const event = DwollaWebhook.createFromDetail(
        id,
        resourceId,
        topic,
        ChargeStatus.PENDING,
      );
      await this.dwollaWebhookDAO.add(event);
      const handler = DwollaEventHandlerFactory.createHandlerFromTopic(
        event,
        this.honeycombDwollCustomerRepository,
        this.userRepository,
        this.issuerRepository,
        this.dwollaService,
        this.issuerBankRepository,
        this.investorBankDAO,
        this.chargeRepository,
        this.campaignEscrowBankRepository,
        this.userMediaRepository,
        this.dwollaToBankTransactionsRepository,
        this.repaymentsRepository,
        this.dwollaPostTransactionsRepository,
        this.dwollaPostBankTransactionsRepository,
        this.dwollaPreTransactionRepository,
        this.campaignRepository,
        this.entityIntermediaryRepository,
        this.transactionsHistoryRepository,
      );

      if (!handler) {
        event.setStatus(ChargeStatus.SUCCESS);
        await this.dwollaWebhookDAO.update(event);
        continue;
      }

      const result = await handler.execute();
      if (result) {
        event.setStatus(ChargeStatus.SUCCESS);
      }

      await this.dwollaWebhookDAO.update(event);
    }
  }

  async handleInvestReadyWebhook(handleInvestReadyWebhookDTO) {
    // get user by hash
    const user = await this.userRepository.fetchByHash(
      handleInvestReadyWebhookDTO.getUserHash(),
    );

    if (!user) {
      return;
    }

    const investorAccreditation = await this.investorAccreditationDAO.fetchByInvestorId(
      user.investor.investorId,
    );

    if (!investorAccreditation) {
      return;
    }

    if (
      handleInvestReadyWebhookDTO.getReason() === InvestReadyVerificationStatus.FAILED
    ) {
      const html = accreditationFailedTemplate.replace(
        '{@USERNAME}',
        user.firstName || user.email,
      );

      user.investor.setIsAccredited(InvestorAccreditationStatus.NOT_ACCREDITED);
      investorAccreditation.setResult(false, new Date());

      await Promise.all([
        this.userRepository.update(user),
        this.investorAccreditationDAO.update(investorAccreditation),
        SendHtmlEmail(user.email, 'Accredited Investor Check Failed', html),
      ]);

      return true;
    }

    if (
      handleInvestReadyWebhookDTO.getReason() === InvestReadyVerificationStatus.SUCCESS
    ) {
      const {
        token: userToken,
        refreshToken,
      } = await this.investReadyService.refreshUserToken(
        user.investor.investReadyRefreshToken,
      );

      const {
        isAccredited,
        lastExpiry,
        userHash,
      } = await this.investReadyService.getUser(userToken);

      user.investor.setInvestReadyInfo(userHash, userToken, refreshToken);
      investorAccreditation.setResult(InvestorAccreditationStatus.ACCREDITED, new Date());

      if (isAccredited && lastExpiry && lastExpiry !== new Date()) {
        user.investor.setIsAccredited(InvestorAccreditationStatus.ACCREDITED);
        user.investor.setAccreditationExpiryDate(lastExpiry);
      }

      await Promise.all([
        this.userRepository.update(user),
        this.investorAccreditationDAO.update(investorAccreditation),
      ]);

      return true;
    }
  }
  async sendSlackNotification(user, kycStatus) {
    const notificationMessage = `${user.email} attempted kyc and uploaded id, result: ${kycStatus}`;
    await this.slackService.publishMessage({ message: notificationMessage });
    return;
  }

  async handleIdologyWebhook(IdologyWebhookDTO) {
    /**
     * @typedef {{response: {"id-number": string,"id-scan-result": string}}} IdologyScanCallback
     */
    const { response } = IdologyWebhookDTO.getData();

    const scanId = response['id-number'];

    const idologyTimestamp = await this.idologyTimestampDAO.fetchByIdologyId(scanId);

    if (!idologyTimestamp) {
      return;
    }

    const user = await this.userRepository.fetchById(idologyTimestamp.userId, true);

    if (!user) {
      return;
    }

    const scanApproved =
      response['id-scan-result'] &&
      response['id-scan-result'].key === this.idologyService.IdScanApproved.APPROVED;
    const templateIdentified =
      response['id-scan-result'] &&
      response['id-scan-result'].message ===
        this.idologyService.ScanVerificationResult.TEMPLATE_IDENTIFIED;

    if (!scanApproved) {
      this.sendSlackNotification(user, KycStatus.FAIL);
      idologyTimestamp.setIsVerified(KycStatus.FAIL);
      user.isVerified = KycStatus.FAIL;

      return await Promise.all([
        this.userRepository.update(user),
        this.idologyTimestampDAO.update(idologyTimestamp),
      ]);
    }

    const fetchScanResponse = await this.idologyService.fetchResults(scanId);

    const {
      isScanPending,
      isDocumentVerified,
      isSummaryResultPassed,
    } = fetchScanResponse;

    if (isScanPending) {
      // handle pending case , wont' be needed because we use scan verify callback
      // just to account for it
    }

    if (!isDocumentVerified) {
      // mark as failed, update database
      this.sendSlackNotification(user, KycStatus.FAIL);
      idologyTimestamp.setIsVerified(KycStatus.FAIL);
      user.isVerified = KycStatus.FAIL;

      return await Promise.all([
        SendHtmlEmail(
          user.email,
          'Id Verification Failed',
          userDocumentFailedTemplate.replace('{@FIRST_NAME}', user.firstName),
        ),
        this.userRepository.update(user),
        this.idologyTimestampDAO.update(idologyTimestamp),
      ]);
    }

    if (isSummaryResultPassed) {
      // mark as success, update database
      this.sendSlackNotification(user, KycStatus.PASS);
      idologyTimestamp.setIsVerified(KycStatus.PASS);
      user.setKycStatus(KycStatus.PASS);
      user.idVerifiedPrompt = true;
      if (user.notificationToken) {
        await this.pushNotificationService.sendIdologyIdVerifiedNotification(user);
      }
      await Promise.all([
        SendHtmlEmail(
          user.email,
          'Id Verified',
          IdolodyScanApprovedTemplate.replace('{@FIRST_NAME}', user.firstName),
        ),
        this.userRepository.update(user),
        this.idologyTimestampDAO.update(idologyTimestamp),
      ]);
      try {
        await this.eventBus.publish(user.pullDomainEvents());
      } catch (err) {}
      return;
    }

    idologyTimestamp.setIsVerified(KycStatus.MANUAL_REVIEW);
    user.isVerified = KycStatus.MANUAL_REVIEW;
    await this.sendSlackNotification(user, KycStatus.MANUAL_REVIEW);

    const { qualifiers, userData } = fetchScanResponse;

    const userDataHtml = [];
    for (let objectKey in userData) {
      const value = userData[objectKey];
      const key = objectKey.substring(8, objectKey.length);

      const dateFields = [
        'id-scan-date-of-issuance',
        'id-scan-expiration-date',
        'id-scan-date-of-birth',
      ];
      if (dateFields.includes(objectKey)) {
        userDataHtml.push(`<li> ${key}: ${value.year}-${value.month} </li>`);
        continue;
      }
      userDataHtml.push(`<li> ${key}: ${value} </li>`);
    }

    // email to info@miventure.com with user's info & the image they uploaded
    const html = IdologyManualReviewTemplate.replace('{@EMAIL}', user.email)
      .replace('{@USER_DATA}', userDataHtml.join(''))
      .replace('{@QUALIFIERS}', qualifiers.map((item) => `<li>${item}</li>`).join(''));

    return await Promise.all([
      SendHtmlEmail(
        EmailConfig.HONEYCOMB_EMAIL,
        'Kyc Manual Verification Required',
        html,
      ),
      this.userRepository.update(user),
      this.idologyTimestampDAO.update(idologyTimestamp),
    ]);
  }

  async getAllWebhookResponses(
    getAllWebhookResponsesDTO: GetAllWebhookResponsesDTO,
  ): Promise<any> {
    const userId = getAllWebhookResponsesDTO.getUserId();
    const customerType = getAllWebhookResponsesDTO.getCustomerType();
    const dwollaCustomer = await this.dwollaCustomerRepository.fetchByCustomerTypeAndUser(
      userId,
      customerType,
    );
    let dwollaCustomerId = null;
    if (dwollaCustomer !== null) {
      dwollaCustomerId = dwollaCustomer.getDwollaCustomerId();
    }
    const result = await this.dwollaWebhookDAO.fetchAll({
      paginationOptions: getAllWebhookResponsesDTO.getPaginationOptions(),
      showTrashed: getAllWebhookResponsesDTO.isShowTrashed(),
      query: getAllWebhookResponsesDTO.getQuery(),
      dwollaCustomerId,
    });

    const response = result.getPaginatedData();
    response.data = response.data.map((dwollaWebhook) => {
      return {
        ...dwollaWebhook,
        dwollaBalanceId: dwollaCustomer.getDwollaBalanceId(),
      };
    });
    return response;
  }

  async verifyAsanaWebhookSignature(
    payload: any,
    receivedSignature: string,
  ): Promise<boolean> {
    const computedSignature = crypto
      .createHmac('SHA256', asanaConfig.ASANA_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(computedSignature),
    );
  }

  async handleAsanaWebhook(events: any[]): Promise<void> {
    for (const event of events) {
      if (event.change.new_value.gid === asanaConfig.THREAD_BANK_APPROVAL_GID) {
        const task = await this.asanaService.fetchTaskByGid(event.resource.gid);

        let status: string;
        let debitAuthorizationId: string;

        for (const customField of task.data.custom_fields) {
          if (customField.gid === asanaConfig.THREAD_BANK_APPROVAL_GID) {
            status = customField.display_value;
          } else if (customField.gid === asanaConfig.DEBIT_AUTHORIZATION_ID) {
            debitAuthorizationId = customField.display_value;
          }
        }

        await this.asanaWebhook.handleAsanaWebhook(status, debitAuthorizationId);
      }
    }
  }
}

export default WebhookService;
