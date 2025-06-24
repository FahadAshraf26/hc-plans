import {
  IFundReturnRequestUseCaseId,
  IFundReturnRequestUseCase,
} from '@application/CampaignFund/FundReturnRequest/IFundRefturnRequestUseCase';
import CreateCampaignFundDTO from '@application/CampaignFund/createCampaignFund/CreateCampaignFundDTO';
import FindCampaignFundDTO from '@application/CampaignFund/FindCampaignFundDTO';
import UpdateCampaignFundDTO from '@application/CampaignFund/UpdateCampaignFundDTO';
import RemoveCampaignFundDTO from '@application/CampaignFund/RemoveCampaignFundDTO';
import GetCampaignFundDTO from '@application/CampaignFund/GetCampaignFundDTO';
import GetReportDTO from '@application/CampaignFund/GetReportDTO';
import GetCampaignInvestmentsDTO from '@application/CampaignFund/GetCampaignInvestmentsDTO';
import GetCampaignInvestmentsReportDTO from '@application/CampaignFund/GetCampaignInvestmentsReportDTO';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';
import { inject, injectable } from 'inversify';
import {
  ICampaignFundService,
  ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import {
  ICreateCampaignFundUseCase,
  ICreateCampaignFundUseCaseId,
} from '@application/CampaignFund/createCampaignFund/ICreateCampaignFundUseCase';
import FundReturnRequestDTO from '@application/CampaignFund/FundReturnRequest/FundReturnRequestDTO';
import investorInvestmentOnCampaignsWithPaginationDTO from '@application/CampaignFund/InvestorInvestmentOnCampaignsWithPaginationDTO';
import InvestorInvestmentOnCampaignsWithoutPaginationDTO from '@application/CampaignFund/InvestorInvestmentOnCampaignWithOutPaginationDTO';
import InvestorCampaignInvestment from '@application/CampaignFund/InvestorCampaignInvestmentDTO';
import GetCampaignFundToExportDTO from '@application/CampaignFund/GetCampaignFundToExportDTO';
import GetAllCampaignsReportDTO from '@application/CampaignFund/GetAllCampaignsReportDTO';
import EPayDTO from '@application/CampaignFund/EPay/EPayDTO';
import { IePay, IePayId } from '@application/CampaignFund/EPay/IePay';
import UpdateEPayTransactionDTO from '@application/CampaignFund/EPay/UpdateEPayTransactionDTO';
import CancelEPayTransactionDTO from '@application/CampaignFund/EPay/CancelEPayTransactionDTO';
import UpdateInvestmentStatusDTO from '@application/CampaignFund/UpdateInvestmentStatusDTO';


/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignFundController {
  constructor(
    @inject(ICampaignFundServiceId) private campaignFundService: ICampaignFundService,
    @inject(ICreateCampaignFundUseCaseId)
    private createCampaignFundUseCase: ICreateCampaignFundUseCase,
    @inject(IFundReturnRequestUseCaseId)
    private fundReturnRequest: IFundReturnRequestUseCase,
    @inject(IePayId) private ePayService: IePay,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignFund = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { amount, ip, isRaiseGreenDay } = httpRequest.body;
    const { userId, investorId } = httpRequest.decoded;
    const { transactionType } = httpRequest.query;
    const clientIp = ip || httpRequest.clientIp;
    const platform = httpRequest.headers['req-platform'];
    const isMobilePlatform = platform === 'mobile';

    const dto = new CreateCampaignFundDTO({
      campaignId,
      amount,
      userId,
      investorId,
      ip: clientIp,
      transactionType,
      isMobilePlatform,
      isRaiseGreenDay,
    });

    const response = await this.createCampaignFundUseCase.execute(dto);

    return { body: response };
  };

  createClientSecret = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { amount, ip } = httpRequest.body;
    const { userId } = httpRequest.decoded;
    const { transactionType } = httpRequest.query;
    const clientIp = ip || httpRequest.clientIp;
    const platform = httpRequest.headers['req-platform'];
    const isMobilePlatform = platform === 'mobile';
    const dto = new EPayDTO({
      campaignId,
      amount,
      userId,
      ip: clientIp,
      transactionType,
      isMobilePlatform,
    });
    const response = await this.ePayService.generateClientSecret({ dto });
    return { body: response };
  };

  updateEPayTransfers = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { amount, ip, transferId, referenceNumber, isRaiseGreenDay } = httpRequest.body;
    const { userId, investorId } = httpRequest.decoded;
    const { transactionType } = httpRequest.query;
    const platform = httpRequest.headers['req-platform'];
    const isMobilePlatform = platform === 'mobile';
    const dto = new UpdateEPayTransactionDTO({
      campaignId,
      userId,
      investorId,
      amount,
      ip,
      isMobilePlatform,
      transferId,
      referenceNumber,
      transactionType,
      isRaiseGreenDay,
    });
    const response = await this.ePayService.updateEPayTransactions({ dto });
    return { body: response };
  };

  cancelPaymentIntent = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { transactionType } = httpRequest.query;
    const { transferId, referenceNumber } = httpRequest.body;
    const { userId } = httpRequest.decoded;
    const dto = new CancelEPayTransactionDTO({
      campaignId,
      userId,
      transferId,
      referenceNumber,
      transactionType,
    });
    const response = await this.ePayService.cancelPaymentIntent({ dto });
    return { body: response };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignFund = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed, query } = httpRequest.query;

    const input = new GetCampaignFundDTO(campaignId, page, perPage, showTrashed, query);
    const response: any = await this.campaignFundService.getCampaignFund(input);

    response.data = response.data.map((row) => CampaignFundMap.toDTO(row));

    return { body: response };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignFund = async (httpRequest) => {
    const { campaignId, campaignFundId } = httpRequest.params;

    const input = new UpdateCampaignFundDTO({
      ...httpRequest.body,
      campaignId,
      campaignFundId,
      ip: httpRequest.body.ip || httpRequest.clientIp,
    });
    await this.campaignFundService.updateCampaignFund(input);

    return {
      body: {
        status: 'success',
        message: 'campaign fund updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignFund = async (httpRequest) => {
    const { campaignFundId } = httpRequest.params;

    const input = new FindCampaignFundDTO(campaignFundId);
    const campaignFund = await this.campaignFundService.findCampaignFund(input);

    return {
      body: {
        status: 'success',
        data: campaignFund,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignFund = async (httpRequest) => {
    const { campaignId, campaignFundId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const input = new RemoveCampaignFundDTO(campaignFundId, campaignId, hardDelete);
    await this.campaignFundService.removeCampaignFund(input);

    return {
      body: {
        status: 'success',
        message: 'campaign pledge deleted successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getReport = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { startDate, endDate } = httpRequest.body;
    const input = new GetReportDTO(startDate, endDate, campaignId);
    const dailyReport = await this.campaignFundService.getReport(input);
    return {
      body: {
        status: 'success',
        data: dailyReport,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllCampaignsReport = async (httpRequest) => {
    const { startDate, endDate, campaignNames, campaignStatuses } = httpRequest.body;
    const input = new GetAllCampaignsReportDTO(
      startDate,
      endDate,
      campaignNames,
      campaignStatuses,
    );
    const dailyReport = await this.campaignFundService.getMultipleCampaignsReport(input);
    return {
      body: {
        status: 'success',
        data: dailyReport,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignInvestments = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const {
      page,
      perPage,
      showTrashed,
      includePending = false,
      query = '',
    } = httpRequest.query;

    const input = new GetCampaignInvestmentsDTO(
      campaignId,
      page,
      perPage,
      showTrashed,
      includePending,
      query,
    );

    const result = await this.campaignFundService.getCampaignInvestments(input);
    return { body: result };
  };

  getCampaignInvestmentsReport = async (httpRequest) => {
    const { showTrashed, includePending = false, query = '' } = httpRequest.query;

    const input = new GetCampaignInvestmentsReportDTO(showTrashed, includePending, query);

    const result = await this.campaignFundService.getCampaignInvestmentsReport(input);
    return { body: result };
  };

  returnFundRequest = async (httpRequest) => {
    const { campaignFundId } = httpRequest.params;
    const ip = httpRequest.clientIp;
    const requestedBy = httpRequest.adminUser.adminUserId;

    const input = new FundReturnRequestDTO(campaignFundId, ip, requestedBy);
    await this.fundReturnRequest.execute(input);

    return {
      body: {
        status: 'success',
        message: 'Fund cancelled successfully',
      },
    };
  };

  getInvestorInvestmentsOnCampaignsWithPagination = async (httpRequest) => {
    const { investorId } = httpRequest.params;
    const { page, perPage } = httpRequest.query;
    const input = new investorInvestmentOnCampaignsWithPaginationDTO(
      investorId,
      page,
      perPage,
    );

    const data = await this.campaignFundService.fetchInvestorInvestmentOnCampaignsWithPagination(
      input,
    );

    return { body: data };
  };

  getInvestorInvestmentsOnCampaignsWithoutPagination = async (httpRequest) => {
    const { investorId } = httpRequest.params;
    const input = new InvestorInvestmentOnCampaignsWithoutPaginationDTO(investorId);

    const data = await this.campaignFundService.fetchInvestorInvestmentOnCampaignsWithOutPagination(
      input,
    );

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getInvestorCampaignsInvestment = async (httpRequest) => {
    const { investorId, campaignId } = httpRequest.params;
    const { page, perPage } = httpRequest.query;
    const input = new InvestorCampaignInvestment(investorId, campaignId, page, perPage);

    const data = await this.campaignFundService.fetchInvestorCampaignInvestment(input);

    return { body: data };
  };

  getCampaignFundToExport = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new GetCampaignFundToExportDTO(campaignId);
    const data = await this.campaignFundService.getCampaignFundToExport(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  chargeInvestor = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { email, tradeId, amount } = httpRequest.body;
    const data = await this.campaignFundService.chargeInvestor(
      email,
      tradeId,
      campaignId,
      amount,
    );
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllCampaignsInvestmentDetailReport = async (httpRequest) => {
    const { startDate, endDate, campaignNames, campaignStatuses } = httpRequest.body;
    const input = new GetAllCampaignsReportDTO(
      startDate,
      endDate,
      campaignNames,
      campaignStatuses,
    );
    const dailyReport = await this.campaignFundService.getAccumulatedCampaignInvestmentReport(
      input,
    );
    return {
      body: {
        status: 'success',
        data: dailyReport,
      },
    };
  };

    /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateInvestmentStatus = async (httpRequest) => {
    const { campaignFundId,campaignId } = httpRequest.params;
    const { transactionStatus, tradeId, referenceNumber } = httpRequest.body;
    const input = new UpdateInvestmentStatusDTO(
      campaignId,
      campaignFundId,
      transactionStatus,
      tradeId,
      referenceNumber
    );

    const response = await this.campaignFundService.updateInvestmentStatus(input);
    return {
      body: {
        status: 'success',
        message: 'Investment status updated successfully',
        data: response
      }
    };
  };
}

export default CampaignFundController;
