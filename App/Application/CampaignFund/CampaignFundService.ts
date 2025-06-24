import FindCampaignFundDTO from '@application/CampaignFund/FindCampaignFundDTO';
import GetCampaignFundDTO from '@application/CampaignFund/GetCampaignFundDTO';
import GetCampaignInvestmentsDTO from '@application/CampaignFund/GetCampaignInvestmentsDTO';
import GetReportDTO from '@application/CampaignFund/GetReportDTO';
import { ICampaignFundService } from '@application/CampaignFund/ICampaignFundService';
import RemoveCampaignFundDTO from '@application/CampaignFund/RemoveCampaignFundDTO';
import UpdateCampaignFundDTO from '@application/CampaignFund/UpdateCampaignFundDTO';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';
import Investor from '@domain/Core/Investor/Investor';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { InvestorAccreditationStatus } from '@domain/Core/ValueObjects/InvestorAccreditationStatus';
import { IInvestorPaymentOptionsRepositoryId } from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config/';
import HttpException from '@infrastructure/Errors/HttpException';
import InvestorPaymentOptionsRepository from '@infrastructure/MySQLRepository/InvestorPaymentOptions/InvestorPaymentOptionsRepository';
import {
  IInvestReadyService,
  IInvestReadyServiceId,
} from '@infrastructure/Service/InvestReadyService/IInvestReadyService';
import mailService from '@infrastructure/Service/MailService';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { inject, injectable } from 'inversify';
import GetAllCampaignsReportDTO from './GetAllCampaignsReportDTO';
import GetCampaignFundToExportDTO from './GetCampaignFundToExportDTO';
import GetCampaignInvestmentsReportDTO from './GetCampaignInvestmentsReportDTO';
import InvestorCampaignInvestmentDTO from './InvestorCampaignInvestmentDTO';
import InvestorInvestmentOnCampaignWithOutPaginationDTO from './InvestorInvestmentOnCampaignWithOutPaginationDTO';
import InvestorInvestmentOnCampaignsWithPaginationDTO from './InvestorInvestmentOnCampaignsWithPaginationDTO';
import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import UpdateInvestmentStatusDTO from './UpdateInvestmentStatusDTO';
import { IChargeRepository, IChargeRepositoryId } from '@domain/Core/Charge/IChargeRepository';
import { IHybridTransactionRepoistory, IHybridTransactionRepoistoryId } from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
const { SendHtmlEmail } = mailService;
const {
  renewAccreditationTemplate,
  refundRequestTemplate,
  refundRequestCompletedTemplate,
} = emailTemplates;
const { investReady: investReadyConfig, dwolla } = config;

type response = {
  status: string;
  paginationInfo;
  data: Array<CampaignFund>;
};

@injectable()
class CampaignFundService implements ICampaignFundService {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IInvestReadyServiceId) private investReadyService: IInvestReadyService,
    @inject(IInvestorDaoId) private investorDAO: IInvestorDao,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private paymentOptionRepository: InvestorPaymentOptionsRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IHybridTransactionRepoistoryId) private hybridTransactionRepository: IHybridTransactionRepoistory,
  ) {}
  /**
   *
   * @param {string} email
   * @param {Investor} investor
   */
  async renewAccreditation(email: string, investor: Investor): Promise<void> {
    const {
      isAccredited,
      userHash,
      lastExpiry,
      token,
      refreshToken,
    } = await this.investReadyService.refreshTokenAndGetUser(
      investor.investReadyRefreshToken,
    );

    investor.setInvestReadyInfo(userHash, token, refreshToken);

    if (isAccredited) {
      investor.setIsAccredited(InvestorAccreditationStatus.ACCREDITED);
      investor.setAccreditationExpiryDate(lastExpiry);
      await this.investorDAO.update(investor);
    } else {
      const html = renewAccreditationTemplate.replace(
        '{@LINK}',
        investReadyConfig.SIGNUP_URL,
      );

      await SendHtmlEmail(
        email,
        'Action Needed: Accredited Investor Status Renewal',
        html,
      );
    }
  }

  async getCampaignFund(getCampaignFundDTO: GetCampaignFundDTO): Promise<response> {
    const result = await this.campaignFundRepository.fetchByCampaign(
      getCampaignFundDTO.getCampaignId(),
      getCampaignFundDTO.getPaginationOptions(),
      getCampaignFundDTO.isShowTrashed(),
      getCampaignFundDTO.getQuery(),
    );

    return result.getPaginatedData();
  }

  async updateCampaignFund(
    updateCampaignFundDTO: UpdateCampaignFundDTO,
  ): Promise<boolean> {
    const campaignFund = await this.campaignFundRepository.fetchById(
      updateCampaignFundDTO.getCampaignFundId(),
    );

    if (!campaignFund) {
      throw new HttpException(400, 'No Campaign Pledges against the provided input');
    }

    const updateResult = await this.campaignFundRepository.update(
      updateCampaignFundDTO.getCampaignFund(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'Update Campaign Fund pledge failed');
    }

    return updateResult;
  }

  async findCampaignFund(
    findCampaignFundDTO: FindCampaignFundDTO,
  ): Promise<CampaignFund> {
    const campaignFund = await this.campaignFundRepository.fetchById(
      findCampaignFundDTO.getCampaignFundId(),
    );

    if (!campaignFund) {
      throw new HttpException(400, 'No Campaign Pledges against the provided input');
    }

    return campaignFund;
  }

  async removeCampaignFund(
    removeCampaignFundDTO: RemoveCampaignFundDTO,
  ): Promise<boolean> {
    const campaignFund = await this.campaignFundRepository.fetchById(
      removeCampaignFundDTO.getCampaignFundId(),
    );

    if (!campaignFund) {
      throw new HttpException(400, 'No Campaign Pledges against the provided input');
    }

    const deleteResult = await this.campaignFundRepository.remove(campaignFund);

    if (!deleteResult) {
      throw new HttpException(400, 'Delete Campaign Pledge Failed!');
    }

    return deleteResult;
  }

  async getAllCampaignFundsByCampaign(campaignId: string): Promise<Array<CampaignFund>> {
    return await this.campaignFundRepository.fetchAllByCampaignWithSuccessfulCharges(
      campaignId,
    );
  }

  async getReport(getReportDTO: GetReportDTO): Promise<any> {
    const result = await this.campaignFundRepository.fetchReport(
      getReportDTO.getStartDate(),
      getReportDTO.getEndDate(),
      getReportDTO.getCampaignId(),
    );
    return Promise.all(
      result.map(async (item) => {
        const numberOfInvestment = await this.campaignFundRepository.countInvestorInvestments(
          item.investorId,
        );
        if (numberOfInvestment > 1) {
          item['repeatInvestor'] = 'Existing';
        } else {
          item['repeatInvestor'] = 'New';
        }
        return item;
      }),
    );
  }

  async getMultipleCampaignsReport(getAllCampaignsReport: GetAllCampaignsReportDTO) {
    const result = await this.campaignFundRepository.fetchMultipleCampaignsReport(
      getAllCampaignsReport.getStartDate(),
      getAllCampaignsReport.getEndDate(),
      getAllCampaignsReport.getCampaignNames(),
      getAllCampaignsReport.getCampaignStatuses(),
    );
    let campaignInvestmentObject = [];
    await result.forEach(async (item) => {
      const transactionTypeLower = item.campaignHybridTransactions.transactionType.toLowerCase();
      const { applicationFee, amount } = item.campaignHybridTransactions;
      let accountType;
      let netAmount = 0;
      if (
        transactionTypeLower === 'creditcard' ||
        transactionTypeLower === 'googlepay' ||
        transactionTypeLower === 'applepay' ||
        transactionTypeLower === 'wallet'
      ) {
        accountType =
          transactionTypeLower === 'creditcard'
            ? 'Credit Card'
            : transactionTypeLower === 'googlepay'
              ? 'Google Pay'
              : transactionTypeLower === 'applepay'
                ? 'Apple Pay'
                : 'Wallet';
      } else {
        accountType = transactionTypeLower === 'hybrid' ? 'Hybrid' : 'ACH';
      }

      let investmentObj = {
        'Campaign Id': item.campaign.campaignId,
        'Campaign Name': item.campaign.campaignName,
        'Investment Status': item.campaignHybridTransactions.status,
        'Escrow Bank': item.campaign.escrowType,
        'Investment Date': item.createdAt,
        'Investor Name': `${item.campaignInvestor.user.firstName} ${item.campaignInvestor.user.lastName}`,
        'Investor Email': item.campaignInvestor.user.email,
        'Entity Name': item.entity,
        'Source': item.campaignHybridTransactions.source,
        'Trade Id': item.campaignHybridTransactions.tradeId,
      }

      const status = item.campaignHybridTransactions.status;
      if (accountType === 'Hybrid') {
        if (status === ChargeStatus.SUCCESS || status === ChargeStatus.PENDING || status === ChargeStatus.REFUND_APPROVED || status === ChargeStatus.REFUND_FAILED) {
          netAmount = item.campaignHybridTransactions.amount + applicationFee;
        }
        campaignInvestmentObject.push({
          ...investmentObj,
          "Investment Amount": dollarFormatter.format(item.campaignHybridTransactions.amount),
          "Net Amount": dollarFormatter.format(netAmount),
          "Account Type": "Hybrid-Ach",
          "Fee": dollarFormatter.format(applicationFee),
          "Transaction Id": item.campaignHybridTransactions.tradeId,
        })

        campaignInvestmentObject.push({
          ...investmentObj,
          "Investment Amount": dollarFormatter.format(item.campaignHybridTransactions.walletAmount),
          "Net Amount": netAmount > 0 ? dollarFormatter.format(item.campaignHybridTransactions.walletAmount): dollarFormatter.format(netAmount),
          "Account Type": "Hybrid-Wallet",
          "Fee": dollarFormatter.format(0),
          "Transaction Id": item.campaignHybridTransactions.dwollaTransactionId,
        })
      } else {
        if (status === ChargeStatus.SUCCESS || status === ChargeStatus.PENDING || status === ChargeStatus.REFUND_APPROVED || status === ChargeStatus.REFUND_FAILED) {
          netAmount = item.netAmount;
        }
        campaignInvestmentObject.push({
          ...investmentObj,
          "Investment Amount": dollarFormatter.format(amount),
          "Net Amount": dollarFormatter.format(netAmount),
          "Account Type": accountType,
          "Fee": dollarFormatter.format(applicationFee),
          "Transaction Id": accountType === 'Wallet' ? item.campaignHybridTransactions.dwollaTransactionId : item.campaignHybridTransactions.tradeId,
        })
      }
      netAmount = 0;
    });

    return campaignInvestmentObject;
  }

  async getCampaignInvestments(
    getCampaignInvestmentsDTO: GetCampaignInvestmentsDTO,
  ): Promise<response> {
    const campaignId = getCampaignInvestmentsDTO.getCampaignId();

    const campaign = await this.campaignRepository.fetchById(campaignId);

    if (!campaign) {
      throw new HttpException(400, 'no such campaign');
    }

    const result = await this.campaignFundRepository.fetchByCampaignAndGroupByInvestorId({
      campaignId,
      paginationOptions: getCampaignInvestmentsDTO.getPaginationOptions(),
      showTrashed: getCampaignInvestmentsDTO.isShowTrashed(),
      includePending: getCampaignInvestmentsDTO.isIncludePending() || false,
      query: getCampaignInvestmentsDTO.getQuery() || '',
    });

    return result.getPaginatedData();
  }

  async getCampaignInvestmentsReport(
    getCampaignInvestmentsReportDTO: GetCampaignInvestmentsReportDTO,
  ): Promise<response> {
    const result = await this.campaignFundRepository.fetchAllCampaignsInvestments(
      getCampaignInvestmentsReportDTO.isShowTrashed(),
      getCampaignInvestmentsReportDTO.getQuery(),
    );

    return result;
  }

  /**
   * It will send refund follow up email
   * @param {*} chargeId
   * @param {*} isRefundRequested
   * @param {*} isRefunded
   */
  async sendRefundFollowUpEmail(
    chargeId: string,
    isRefundRequested: boolean,
    isRefunded: boolean,
  ): Promise<boolean> {
    const isInvestment = await this.campaignFundRepository.fetchByChargeId(chargeId);
    if (isInvestment && (isRefundRequested || isRefunded)) {
      const htmlTemplate = isRefunded
        ? refundRequestCompletedTemplate
        : refundRequestTemplate;
      const emailSubject = isRefunded ? 'Refund Request Complete' : 'Refund Request';
      return await SendHtmlEmail(
        isInvestment.Investor().user.email,
        emailSubject,
        htmlTemplate.replace('{@FIRST_NAME}', isInvestment.Investor().user.firstName),
      );
    }
    return true;
  }

  async fetchInvestorCampaignInvestment(
    investorCampaignInvestmentDTO: InvestorCampaignInvestmentDTO,
  ) {
    const result = await this.campaignFundRepository.fetchInvestorCampaignInvestment({
      investorId: investorCampaignInvestmentDTO.getInvestorId(),
      campaignId: investorCampaignInvestmentDTO.getCampaignId(),
      paginationOptions: investorCampaignInvestmentDTO.getPaginationOptions(),
    });
    return result.getPaginatedData();
  }

  async fetchInvestorInvestmentOnCampaignsWithPagination(
    investorInvestmentOnCampaignsWithPaginationDTO: InvestorInvestmentOnCampaignsWithPaginationDTO,
  ) {
    const result = await this.campaignFundRepository.fetchInvestorInvestmentOnCampaignsWithPagination(
      {
        paginationOptions: investorInvestmentOnCampaignsWithPaginationDTO.getPaginationOptions(),
        investorId: investorInvestmentOnCampaignsWithPaginationDTO.getInvestorId(),
      },
    );
    return result.getPaginatedData();
  }

  async fetchInvestorInvestmentOnCampaignsWithOutPagination(
    investorInvestmentOnCampaignWithOutPaginationDTO: InvestorInvestmentOnCampaignWithOutPaginationDTO,
  ) {
    return this.campaignFundRepository.fetchInvestorInvestmentOnCampaignsWithOutPagination(
      {
        investorId: investorInvestmentOnCampaignWithOutPaginationDTO.getInvestorId(),
      },
    );
  }

  async getCampaignFundToExport(
    getCampaignFundToExport: GetCampaignFundToExportDTO,
  ): Promise<any> {
    const data = await this.campaignFundRepository.fetchByCampaignToExport(
      getCampaignFundToExport.getCampaignId(),
    );

    return data;
  }

  async chargeInvestor(
    email: string,
    tradeId: string,
    campaignId: string,
    amount: number,
  ) {
    const user = await this.userRepository.fetchByEmail(email, false);
    const campaign = await this.campaignRepository.fetchById(campaignId);
    const paymentOption = await this.paymentOptionRepository.fetchInvestorBank(
      user.InvestorId(),
    );
    try {
      const referenceNumber = await northCapitalService.externalFundMove({
        accountId: user.NcAccountId(),
        tradeId,
        offeringId: campaign.OfferingId(),
        ip: '34.117.233.212',
        amount: amount,
        NickName: `${paymentOption.getBank().getAccountType()} account`,
        description: `investment in ${
          campaign.campaignName
          } with id ${campaign.OfferingId()}`,
        checkNumber: tradeId,
      });
      return referenceNumber;
    } catch (error) {
      await northCapitalService.deleteTrade(user.NcAccountId(), tradeId);
      throw new Error(error);
    }
  }

  async getAccumulatedCampaignInvestmentReport(
    getAllCampaignsReport: GetAllCampaignsReportDTO,
  ) {
    const [campaignDetailInvestment] = await Promise.all([
      await this.campaignFundRepository.fetchSumInvestmentByCampaignsReport(
        getAllCampaignsReport.getCampaignNames(),
        true,
        getAllCampaignsReport.getCampaignStatuses(),
        getAllCampaignsReport.getStartDate(),
        getAllCampaignsReport.getEndDate(),
      ),
    ]);
    if (campaignDetailInvestment.length === 0) {
      return 0;
    }
    const newCampaignDetailInvestment = [];
    for (const i of campaignDetailInvestment) {
      const test = newCampaignDetailInvestment.findIndex((v) => {
        return v['Campaign ID'] === i['Campaign ID'];
      });
      if (test != -1) {
        if (newCampaignDetailInvestment[test]['status'] === ChargeStatus.SUCCESS) {
          newCampaignDetailInvestment[test]['Non-cleared Amount'] =
            i['Non-cleared Amount'];
        } else {
          newCampaignDetailInvestment[test]['Cleared Amount'] = i['Cleared Amount'];
        }
      } else {
        newCampaignDetailInvestment.push(i);
      }
    }

    return newCampaignDetailInvestment.map((item) => {
      return {
        ...item,
        'Non-cleared Amount (%)':
          item['Non-cleared Amount'] / (Number(item['Cleared Amount']) +
            Number(item['Non-cleared Amount'])) * 100,
        'Cleared Amount (%)':
          item['Cleared Amount'] / (Number(item['Cleared Amount']) +
            Number(item['Non-cleared Amount'])) * 100,
      };
    });
  }

  async updateInvestmentStatus(input: UpdateInvestmentStatusDTO): Promise<any> {
    const campaignFund = await this.campaignFundRepository.fetchById(input.CampaignFundId());
    if (!campaignFund) {
      throw new HttpException(400, 'Campaign fund not found');
    }

    if (!input.isValidStatus()) {
      throw new HttpException(400, 'Invalid transaction status');
    }

    try {
      // Update charge
      const chargeObj = campaignFund.Charge();
      if (chargeObj) {
        const updatedCharge = {
          ...chargeObj,
          chargeStatus: input.TransactionStatus(),
          ...(input.ReferenceNumber() && { referenceNumber: input.ReferenceNumber() })
        };
        await this.chargeRepository.update(updatedCharge);
      }

      // Update hybrid transaction
      const hybridTransactions = await this.hybridTransactionRepository.fetchAllByCampaignFundId(input.CampaignFundId());
      if (hybridTransactions && hybridTransactions.length > 0) {
        const updatePromises = hybridTransactions.map(function(hybridTransaction) {
          const newHybridTransaction = {
            ...hybridTransaction,
            status: input.TransactionStatus(),
            ...(input.TradeId() && { tradeId: input.TradeId() }),
            ...(input.ReferenceNumber() && { refrenceNumber: input.ReferenceNumber() })
          };
          return this.hybridTransactionRepository.update(newHybridTransaction);
        }, this);

        await Promise.all(updatePromises);
      }

      return {
        status: 'success',
        data: {
          campaignFund: campaignFund,
        }
      };
    } catch (error) {
      throw new HttpException(400, 'Failed to update investment status: ' + error.message);
    }
  }
}

const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export default CampaignFundService;
