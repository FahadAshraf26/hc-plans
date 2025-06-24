import { inject, injectable } from 'inversify';
import {
  ICampaignFundService,
  ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import { IUserService, IUserServiceId } from '@application/User/IUserService';
import Campaign from '@domain/Core/Campaign/Campaign';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';
const { campaignTermsChangedTemplate } = emailTemplates;
const { emailConfig } = config;
const { SendHtmlEmail } = mailService;
@injectable()
class MaterialChangeNotificationService {
  constructor(
    private campaign: Campaign,
    @inject(ICampaignFundServiceId) private campaignFundService?: ICampaignFundService,
    @inject(IUserServiceId) private userService?: IUserService,
  ) {
    this.campaign = campaign;
  }

  async execute() {
    const campaignFunds = await this.campaignFundService.getAllCampaignFundsByCampaign(
      this.campaign.campaignId,
    );

    const fundsByInvestorId = {};
    for (const fund of campaignFunds) {
      if (fundsByInvestorId[fund.investorId]) {
        fundsByInvestorId[fund.investorId] += fund.Amount();
      } else {
        fundsByInvestorId[fund.investorId] = fund.Amount();
      }
    }

    const investorIds = campaignFunds.map((fund) => fund.investorId);

    const users = await this.userService.fetchByInvestorIds(investorIds);

    await Promise.allSettled(
      users.map((user) => {
        const html = campaignTermsChangedTemplate
          .replace('{@USERNAME}', user.firstName)
          .replace('{@ISSUERNAME}', this.campaign.issuer.issuerName)
          .replace('{@CAMPAIGN_NAME}', this.campaign.campaignName)
          .replace('{@CAMPAIGN_NAME}', this.campaign.campaignName)
          .replace('{@AMOUNT}', fundsByInvestorId[user.InvestorId()])
          .replace('{@EMAIL_LINk}', emailConfig.MIVENTURE_SUPPORT_EMAIL);

        return SendHtmlEmail(user.email, 'Reconfirm Investment', html);
      }),
    );
  }
}

export default MaterialChangeNotificationService;
