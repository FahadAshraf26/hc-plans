import BankTransferCompletedHandler from './BankTransferCompletedHandler';
import CustomerTransferCancelledHandler from './CustomerTransferCancelledHandler';
import BankTransferFailedHandler from './BankTransferFailedHandler';
import CustomerTransferCreatedHandler from './CustomerTransferCreatedHandler';
import MassPaymentCompletedHandler from './MassPaymentCompletedHandler';
import CustomerVerificationNeededHandler from './CustomerVerificationNeededHandler';
import CustomerVerificationDocumentFailedHandler from './CustomerVerificationDocumentFailedHandler';
import CustomerVerificationDocumentApprovedHandler from './CustomerVerificationDocumentApprovedHandler';
import CustomerVerifiedHandler from './CustomerVerifiedHandler';
import CustomerCreatedHandler from './CustomerCreatedHandler';
import CustomerVerificationDocumentNeededHandler from './CustomerVerificationDocumentNeededHandler';
import CustomerSuspendedHandler from './CustomerSuspendedHandler';
import CustomerFundingSourceAddedHandler from './CustomerFundingSourceAddedHandler';
import CustomerFundingSourceVerifiedHandler from './CustomerFundingSourceVerifiedHandler';
import CustomerVerificationDocumentUploadedHandler from './CustomerVerificationDocumentUploadedHandler';

class DwollaEventFactory {
  constructor() {}

  static createHandlerFromTopic(
    event,
    honeycombDwollCustomerRepository,
    userRepository,
    issuerRepository,
    dwollaService,
    issuerBankRepository,
    investorBankDAO,
    chargeRepository,
    campaignEscrowBankRepository,
    userMediaRepository,
    dwollaToBankTransactionsRepository,
    repaymentsRepository,
    dwollaPostTransactionsRepository,
    dwollaPostBankTransactionsRepository,
    dwollaPreTransactionRepository,
    campaignRepository,
    entityIntermediaryRepository,
    transactionsHistoryRepository,
  ) {
    switch (event.topic) {
      case 'customer_bank_transfer_completed':
        return new BankTransferCompletedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
          dwollaPreTransactionRepository,
          userRepository,
          campaignRepository,
          entityIntermediaryRepository,
          transactionsHistoryRepository,
        );

      case 'customer_transfer_completed':
        return new BankTransferCompletedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
          dwollaPreTransactionRepository,
          userRepository,
          campaignRepository,
          entityIntermediaryRepository,
          transactionsHistoryRepository,
        );

      case 'customer_transfer_cancelled':
        return new CustomerTransferCancelledHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_bank_transfer_cancelled':
        return new CustomerTransferCancelledHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_transfer_failed':
        return new BankTransferFailedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_bank_transfer_failed	':
        return new BankTransferFailedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_bank_transfer_created':
        return new CustomerTransferCreatedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_transfer_created':
        return new CustomerTransferCreatedHandler(
          event,
          dwollaToBankTransactionsRepository,
          dwollaService,
          repaymentsRepository,
          dwollaPostTransactionsRepository,
          dwollaPostBankTransactionsRepository,
        );

      case 'customer_mass_payment_completed':
        return new MassPaymentCompletedHandler(event, chargeRepository);

      case 'customer_reverification_needed':
        return new CustomerVerificationNeededHandler(
          event,
          userRepository,
          dwollaService,
          honeycombDwollCustomerRepository,
        );

      case 'customer_verification_document_failed':
        return new CustomerVerificationDocumentFailedHandler(event, userMediaRepository);

      case 'customer_verification_document_approved':
        return new CustomerVerificationDocumentApprovedHandler(
          event,
          userMediaRepository,
          honeycombDwollCustomerRepository,
          dwollaService,
        );

      case 'customer_verification_document_needed':
        return new CustomerVerificationDocumentNeededHandler(
          event,
          userRepository,
          dwollaService,
        );

      case 'customer_created':
        return new CustomerCreatedHandler(
          event,
          honeycombDwollCustomerRepository,
          userRepository,
          issuerRepository,
          dwollaService,
        );

      case 'customer_suspended':
        return new CustomerSuspendedHandler(
          event,
          userRepository,
          issuerRepository,
          dwollaService,
        );

      case 'customer_verified':
        return new CustomerVerifiedHandler(
          event,
          honeycombDwollCustomerRepository,
          userRepository,
          issuerRepository,
          dwollaService,
        );

      case 'customer_funding_source_added':
        return new CustomerFundingSourceAddedHandler(
          event,
          issuerBankRepository,
          investorBankDAO,
        );

      case 'customer_funding_source_verified':
        return new CustomerFundingSourceVerifiedHandler(
          event,
          campaignEscrowBankRepository,
        );

      case 'customer_verification_document_uploaded':
        return new CustomerVerificationDocumentUploadedHandler(
          event,
          userMediaRepository,
        );

      case 'customer_beneficial_owner_verification_document_needed':

      case 'customer_beneficial_owner_verification_document_failed':

      case 'customer_beneficial_owner_verification_document_approved':

      case 'customer_beneficial_owner_reverification_needed':

      default:
        return false;
    }
  }
}

export default DwollaEventFactory;
