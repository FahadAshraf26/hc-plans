import logger from '@infrastructure/Logger/logger';
import mailService from '@infrastructure/Service/MailService';
import DwollaCustomerFundingSourceDTO from './DwollaCustomerFundingSourceDTO';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IIssuerBankRepository } from '@domain/Core/IssuerBank/IIssuerBankRepository';
import { IInvestorBankDAO } from '@domain/InvestorPaymentOptions/IInvestorBankDAO';

const { SendHtmlEmail, BakeEmail } = mailService;
const {
  customerFundingSourceAddedInvestorTemplate,
  customerFundingSourceAddedIssuerTemplate,
  UserBankUpdatedTemplate,
  IssuerBankUpdatedTemplate,
} = EmailTemplates;

class CustomerFundingSourceAddedHandler {
  private event: any;
  private issuerBankRepository: IIssuerBankRepository;
  private investorBankDAO: IInvestorBankDAO;

  constructor(
    event: any,
    issuerBankRepository: IIssuerBankRepository,
    investorBankDAO: IInvestorBankDAO,
  ) {
    this.event = event;
    this.issuerBankRepository = issuerBankRepository;
    this.investorBankDAO = investorBankDAO;
  }

  /**
   * It will notify both investor and issuer
   * @returns {Promise<boolean>}
   */
  async execute() {
    try {
      // email saying your account has been suspended, contact support
      const dwollaSourceId = this.event.getResourceId();

      // await this.notifyInvestor(dwollaSourceId);
      // await this.notifyIssuer(dwollaSourceId);

      return true;
    } catch (error) {
      logger.error(error);

      return false;
    }
  }

  /**
   * It will notify investor
   * @param dwollaSourceId
   * @returns {Promise<boolean>}
   */
  async notifyInvestor(dwollaSourceId) {
    // const investorBank = await this.investorBankDAO.fetchByDwollaSourceId(
    //   dwollaSourceId,
    // );
    // if (!investorBank) {
    //   return false;
    // }
    // // check if first account or not
    // const result = await this.investorBankDAO.fetchLatestDeletedBankByInvestorIdExcludingWallet(
    //   investorBank.investorId,
    //   new PaginationOptions(1, 1),
    //   true,
    // );
    // let htmlTemplate;
    // if (result.getItemCount() > 1) {
    //   htmlTemplate = UserBankUpdatedTemplate.replace(
    //     '{@PREVIOUS_BANK_ACCOUNT_NAME}',
    //     result.items[0].accountName,
    //   );
    // } else {
    //   htmlTemplate = customerFundingSourceAddedInvestorTemplate;
    // }
    // const notificationDTO = new DwollaCustomerFundingSourceDTO(investorBank);
    // const fundingSourceAddedInvestorTemplate = await BakeEmail(
    //   notificationDTO,
    //   htmlTemplate,
    // );
    // await SendHtmlEmail(
    //   investorBank.investor.user.email,
    //   'Bank Account Connected',
    //   fundingSourceAddedInvestorTemplate,
    // );
  }

  /**
   * It will notify issuer
   * @param customerId
   * @returns {Promise<boolean>}
   */
  async notifyIssuer(customerId) {
    const issuerBank = await this.issuerBankRepository.fetchByDwollaSourceId(customerId);
    if (!issuerBank) {
      return false;
    }
    const result = await this.issuerBankRepository.fetchLatestDeletedBankByIssuerIdExcludingWallet(
      {
        issuerId: issuerBank.issuerId,
        paginationOptions: new PaginationOptions(1, 1),
        showTrashed: true,
      },
    );
    let htmlTemplate;
    if (result.getItemCount() > 1) {
      htmlTemplate = IssuerBankUpdatedTemplate.replace(
        '{@PREVIOUS_BANK_ACCOUNT_NAME}',
        result.items[0].accountName,
      );
    } else {
      htmlTemplate = customerFundingSourceAddedIssuerTemplate;
    }
    const notificationDTO = new DwollaCustomerFundingSourceDTO(issuerBank);
    const fundingSourceAddedIssuerTemplate = await BakeEmail(
      notificationDTO,
      htmlTemplate,
    );
    await SendHtmlEmail(
      issuerBank.issuer.email,
      'Bank Account Connected',
      fundingSourceAddedIssuerTemplate,
    );
  }
}

export default CustomerFundingSourceAddedHandler;
