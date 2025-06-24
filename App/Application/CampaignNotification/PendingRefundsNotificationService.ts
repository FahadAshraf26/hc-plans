import {
    IPushNotificationService,
    IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import {inject, injectable} from 'inversify';
import {
    ICampaignFundService,
    ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';

const {campaignFailedTemplate} = emailTemplates;
const {emailConfig} = config;
const {SendHtmlEmail} = mailService;
import Campaign from '@domain/Core/Campaign/Campaign';
import {IUserService, IUserServiceId} from '@application/User/IUserService';
import {
    IGlobalHoneycombConfigurationRepository,
    IGlobalHoneycombConfigurationRepositoryId
} from "@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository";

@injectable()
class PendingRefundsNotificationService {
    constructor(
        private campaign: Campaign,
        @inject(IPushNotificationServiceId)
        private pushNotificationService?: IPushNotificationService,
        @inject(ICampaignFundServiceId) private campaignFundService?: ICampaignFundService,
        @inject(IUserServiceId) private userService?: IUserService,
        @inject(IGlobalHoneycombConfigurationRepositoryId) private globalHoneycombConfigurationRepository?: IGlobalHoneycombConfigurationRepository
    ) {
    }

    async execute() {
        const campaignFunds = await this.campaignFundService.getAllCampaignFundsByCampaign(
            this.campaign.campaignId,
        );
        const data = await this.globalHoneycombConfigurationRepository.fetchLatestRecord()
        const investorIds = campaignFunds.map((fund) => fund.investorId);

        const users = await this.userService.fetchByInvestorIds(investorIds);

        const fundsByInvestorId = {};
        for (const fund of campaignFunds) {
            if (fundsByInvestorId[fund.investorId]) {
                fundsByInvestorId[fund.investorId] += fund.Amount();
            } else {
                fundsByInvestorId[fund.investorId] = fund.Amount();
            }
        }

        await Promise.allSettled([
            this.pushNotificationService.sendUnSuccessfulCampaignNotifications(
                this.campaign,
                users,
            ),
            ...users.map((user) => {
                if (!user) return null;
                if (data.configuration.isSendFINRAEmails) {
                    const html = campaignFailedTemplate
                        .replace('{@ISSUERNAME}', this.campaign.campaignName)
                        .replace('{@ISSUERNAME}', this.campaign.campaignName)
                        .replace('{@EMAIL_LINk}', emailConfig.MIVENTURE_SUPPORT_EMAIL)
                        .replace('{@USERNAME}', user.firstName)
                        .replace('{@AMOUNT}', fundsByInvestorId[user.investor.investorId]);

                    return SendHtmlEmail(user.email, 'Campaign Refund :(', html);
                }
            }),
        ]);
    }
}

export default PendingRefundsNotificationService;
