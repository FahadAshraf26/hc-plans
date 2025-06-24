import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import config from '@infrastructure/Config';
import { ICreateTradeWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/createTradeWebhookHandler/ICreateTradeWebhookHandler';

const { northCapital, slackConfig } = config;

@injectable()
class CreateTradeWebhookHandler implements ICreateTradeWebhookHandler {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
  ) {}

  strToBase64 = (string: string) => Buffer.from(string).toString('base64');

  northCapitalUrl = (tradeId: string, ncAccountId: string) => {
    return `${northCapital.webhookURL}/trades_overview?tradeid=${this.strToBase64(
      tradeId,
    )}&accountid=${this.strToBase64(ncAccountId)}&clientid=${this.strToBase64(
      northCapital.clientID,
    )}&developerkey=${this.strToBase64(northCapital.developerAPIKey)}`;
  };

  async execute(dto) {
    await new Promise((r) => setTimeout(r, 5000));
    const { tradeId, transactionAmount } = dto.payload();

    const trade = await this.hybridTransactionRepository.fetchByTradeId(tradeId);

    if (!trade) {
      return false;
    }

    const fund = await this.campaignFundRepository.fetchById(trade.getCampaignFundId());
    const charge = await this.campaignFundRepository.fetchByChargeId(
      fund['charge'].chargeId,
    );

    if (charge) {
      const northCapitalUrl = this.northCapitalUrl(tradeId, charge.investor.ncAccountId);
      await this.slackService.publishMessage({
        message: `${charge.investor.user.email} invested ${dollarFormatter.format(
          transactionAmount,
        )} in "${charge.campaign.campaignName}".`,
        url: northCapitalUrl,
        slackChannelId: slackConfig.NC_WEBHOOK.ID,
      });
    }

    return true;
  }
}

export default CreateTradeWebhookHandler;
