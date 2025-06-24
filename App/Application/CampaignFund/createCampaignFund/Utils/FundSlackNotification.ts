import { IFundSlackNotification } from './IFundSlackNotification';
import { inject, injectable } from 'inversify';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import {
  ISlackServiceId,
  ISlackService,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';

const { slackConfig } = config;

@injectable()
class FundSlackNotification implements IFundSlackNotification {
  constructor(@inject(ISlackServiceId) private slackService: ISlackService) {}

  async execute(
    user,
    campaignFund,
    campaign,
    transactionType = TransactionType.ACH().getValue(),
    amount = { wallet: 0, ach: 0 },
    canAvailPromotionCredits,
  ) {
    const promoMessage = canAvailPromotionCredits
      ? `- *Promo Amount ${canAvailPromotionCredits ? '$5' : '$0'}*`
      : '';
    if (transactionType === TransactionType.Hybrid().getValue()) {
      let attachment = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `• Wallet: ${dollarFormatter.format(
                amount.wallet,
              )} \n• ACH: ${dollarFormatter.format(amount.ach)}`,
            },
          },
        ],
      };
      await this.slackService.publishMessage({
        message: `${user.email} invested (*${transactionType}*) *${dollarFormatter.format(
          Number(amount.wallet) + Number(amount.ach),
        )}* in *${campaign.campaignName}* - *${campaign.escrowType}* ${promoMessage}`,
        slackChannelId: slackConfig.INVESTMENT.ID,
        attachments: attachment,
      });
    } else {
      await this.slackService.publishMessage({
        message: `${user.email} invested (*${transactionType}*) *${dollarFormatter.format(
          amount.ach,
        )}* in *${campaign.campaignName}* - *${campaign.escrowType}* ${promoMessage}`,
        slackChannelId: slackConfig.INVESTMENT.ID,
      });
    }
  }
}

export default FundSlackNotification;
