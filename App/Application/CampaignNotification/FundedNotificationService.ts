import {inject, injectable} from 'inversify';
import {
    ICampaignFundService,
    ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import {IUserService, IUserServiceId} from '@application/User/IUserService';
import {
    IPushNotificationService,
    IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import Campaign from '@domain/Core/Campaign/Campaign';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';

const {campaignSuccessTemplate, campaignEarlySuccessTemplate} = emailTemplates;
const {emailConfig} = config;
const {SendHtmlEmail} = mailService;
import moment from 'moment';
import {
    IGlobalHoneycombConfigurationRepository,
    IGlobalHoneycombConfigurationRepositoryId
} from "@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository";

@injectable()
class FundedNotificationService {
    constructor(
        private campaign: Campaign,
        @inject(ICampaignFundServiceId) private campaignFundService?: ICampaignFundService,
        @inject(IUserServiceId) private userService?: IUserService,
        @inject(IPushNotificationServiceId)
        private pushNotificationService?: IPushNotificationService,
        @inject(IGlobalHoneycombConfigurationRepositoryId) private globalHoneycombConfigurationRepository?: IGlobalHoneycombConfigurationRepository
    ) {
        this.campaign = campaign;
    }

    async execute() {
        try {
            const campaignFunds = await this.campaignFundService.getAllCampaignFundsByCampaign(
                this.campaign.campaignId,
            );

            const data = await this.globalHoneycombConfigurationRepository.fetchLatestRecord()

            const investorIds = campaignFunds.map((fund) => fund.investorId);

            const users = await this.userService.fetchByInvestorIds(investorIds);

            const now = new Date();
            now.setDate(now.getDate() + 2);
            const isEarlySuccess =
                new Date().setHours(0, 0, 0, 0) <
                new Date(this.campaign.campaignExpirationDate).setHours(0, 0, 0, 0);

            const template = isEarlySuccess
                ? campaignEarlySuccessTemplate
                : campaignSuccessTemplate;
            const subject = isEarlySuccess ? ' Early Success!!!' : 'Campaign Success!!!';

            const maturityDate = moment(this.campaign.repaymentStartDate)
                .add(this.campaign.loanDuration, 'y')
                .format('MM/DD/YYYY');

            const totalRaised = campaignFunds.reduce((sum, fund) => sum + fund.Amount(), 0);

            const fundsByInvestorId = {};
            for (const fund of campaignFunds) {
                if (fundsByInvestorId[fund.investorId]) {
                    fundsByInvestorId[fund.investorId] += fund.Amount();
                } else {
                    fundsByInvestorId[fund.investorId] = fund.Amount();
                }
            }

            await Promise.allSettled([
                this.pushNotificationService.sendSuccessfulCampaignNotifications(
                    this.campaign,
                    users,
                ),
                ...users.map((user) => {
                    if (!user) return null;
                    if (data.configuration.isSendFINRAEmails) {
                        const html = template
                            .replace('{@USERNAME}', user.firstName)
                            .replace('{@ISSUERNAME}', this.campaign.issuer.issuerName)
                            .replace('{@ISSUERNAME}', this.campaign.issuer.issuerName)
                            .replace('{@ISSUERNAME}', this.campaign.issuer.issuerName)
                            .replace('{@TOTALAMOUNTRAISED}', totalRaised)
                            .replace('{@AMOUNT}', fundsByInvestorId[user.investor.investorId])
                            .replace('{@CAMPAIGNNAME}', this.campaign.campaignName)
                            .replace('{@CAMPAIGNSUCCESSDATE}', moment().format('MM/DD/YYYY'))
                            .replace('{@TARGETRETURN}', String(this.campaign.annualInterestRate))
                            .replace('{@MATURITYDATE}', maturityDate) // for campaign success and minimum goal

                            .replace('{@CAMPAIGNNAME}', this.campaign.campaignName)
                            .replace('{@CAMPAIGNNAME}', this.campaign.campaignName)
                            .replace('{@EMAIL_LINk}', emailConfig.MIVENTURE_SUPPORT_EMAIL)
                            .replace('{@2DAYSFROMEMAILDATE}', now.toLocaleDateString());

                        return SendHtmlEmail(user.email, subject, html);
                    }
                }),
            ]);

            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default FundedNotificationService;
