import ExcelService from '@infrastructure/Service/ExcelService/ExcelService';
import { inject } from 'inversify';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import mailService from '@infrastructure/Service/MailService';
import moment from 'moment';
import _groupBy from 'lodash.groupby';
import config from '../../../Infrastructure/Config';
const { SendHtmlEmail } = mailService;
const { server } = config;

class CampaignFundDailyEmailProcessor {
  private ExcelService: ExcelService;
  /**
   *
   * @param {ExcelService} ExcelService
   * @param campaignFundRepository
   * @param campaignRepository
   */
  constructor(
    ExcelService: ExcelService,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
  ) {
    this.ExcelService = ExcelService;
  }

  /**
   * runs at the end of the day and sends an email to escrow agent with an excel file
   * of all transactions in the last 24 hours
   */
  async processDailyFundsEmail() {
    const yesterdayDate = moment().subtract(1, 'day');

    const excelColumns = [
      { header: 'Campaign Name', dataKey: 'campaignName' },
      { header: 'DDA Account Number', dataKey: 'DDAAccountNumber' },
      { header: 'Escrow AccountNumber', dataKey: 'escrowAccountNumber' },
      { header: 'Investor Name', dataKey: 'investorName' },
      { header: 'Investment Date', dataKey: 'investmentDate' },
      { header: 'Deposit Amount', dataKey: 'investedAmount' },
      { header: 'Investor Account Number', dataKey: 'accountNumber' },
      { header: 'Investor Routing Number', dataKey: 'routingNumber' },
      { header: 'Account Type', dataKey: 'accountType' },
      { header: 'Account Name', dataKey: 'accountName' },
      { header: 'Refund Requested Date', dataKey: 'refundRequestDate' },
      { header: 'Refunded', dataKey: 'refunded' },
    ];

    const activeCampaigns = await this.campaignRepository.fetchActiveCampaigns();

    const campaignGroupedByEscrowEmail = _groupBy(
      activeCampaigns,
      'campaignEscrow.emailContact',
    );
    let shoudSendEmail = false;
    for (const email in campaignGroupedByEscrowEmail) {
      const campaigns = campaignGroupedByEscrowEmail[email];
      const workBook = this.ExcelService.createWorkbook();
      for (const campaign of campaigns) {
        const funds = await this.campaignFundRepository.fetchReport(
          yesterdayDate,
          yesterdayDate,
          campaign.campaignId,
        );

        if (funds.length === 0) {
          continue;
        }

        shoudSendEmail = true; // means there are some transactions to send

        const worksheetName = `${
          campaign.campaignEscrow.subAccountNumber || 'escrow'
        }_${campaign.campaignName.replace(/\s/g, '_')}`;
        const worksheet = this.ExcelService.createWorksheet(workBook, worksheetName);
        this.ExcelService.specifyWorkSheetColumns(worksheet, excelColumns);
        this.transformFundsDataForExcel(funds).forEach((fund) => {
          worksheet.addRow(fund);
        });
      }

      if (!shoudSendEmail) {
        return;
      }

      const workBookBuffer = await workBook.xlsx.writeBuffer();
      const escrowAgentEmail = server.IS_PRODUCTION
        ? email
        : 'fahad.ashraf@carbonteq.com';
      const cc = server.IS_PRODUCTION ? ['support@honeycombcredit.com'] : [];

      SendHtmlEmail(
        escrowAgentEmail,
        `Miventure investments spreadsheet for ${yesterdayDate.format('MM/DD/YYYY')}`,
        `Please find attached investments and refund requests (if applicable) across all active campaigns for ${yesterdayDate.format(
          'MM/DD/YYYY',
        )}.`,
        [
          {
            filename: `miventure_investments_${yesterdayDate.format('MM/DD/YYYY')}.xlsx`,
            content: workBookBuffer,
          },
        ],
        true,
        cc,
      );
    }
  }

  transformFundsDataForExcel(funds) {
    return funds.map((obj) => {
      const {
        createdAt: investmentDate,
        campaignInvestor,
        amount,
        intermediatoryCharge: { charge },
        campaign: {
          campaignName,
          campaignEscrow: {
            accountNumber: DDAAccountNumber,
            subAccountNumber: escrowAccountNumber,
          },
        },
      } = obj;

      const investor = campaignInvestor || {};
      const refund = charge || {};

      const {
        investorBanks = [],
        user: { firstName, lastName } = { firstName: '', lastName: '' },
      } = investor;
      const investorBank = investorBanks.shift() || {};

      return {
        campaignName,
        investorName: `${firstName} ${lastName}`,
        investedAmount: amount,
        DDAAccountNumber,
        escrowAccountNumber,
        investmentDate: moment.utc(investmentDate).format('MM/DD/YYYY HH:MM:SS'),
        accountType: investorBank.accountType || '',
        accountName: investorBank.accountName || '',
        routingNumber: investorBank.routingNumber || '',
        accountNumber: investorBank.accountNumber || '',
        refundRequestDate: refund.refundRequestDate
          ? moment.utc(refund.refundRequestDate).format('MM/DD/YYYY HH:MM:SS')
          : '',
        refunded: refund.refundRequestDate ? (refund.refunded ? 'Yes' : 'No') : '',
      };
    });
  }
}

export default CampaignFundDailyEmailProcessor;
