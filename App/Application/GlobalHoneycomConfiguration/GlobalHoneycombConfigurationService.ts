import {
  ISlackService,
  ISlackServiceId,
} from './../../Infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import AddGlobalHoneycombConfigurationDTO from '@application/GlobalHoneycomConfiguration/AddGlobalHoneycombConfigurationDTO';
import { IGlobalHoneycombConfigurationService } from '@application/GlobalHoneycomConfiguration/IGlobalHoneycombConfigurationService';
import config from '@infrastructure/Config';

const { slackConfig } = config;
@injectable()
class GlobalHoneycombConfigurationService
  implements IGlobalHoneycombConfigurationService {
  constructor(
    @inject(IGlobalHoneycombConfigurationRepositoryId)
    private globalHoneycombConfigurationRepository: IGlobalHoneycombConfigurationRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async addHoneycombFee(
    addGlobalHoneycombFeeDTO: AddGlobalHoneycombConfigurationDTO,
  ): Promise<boolean> {
    await this.globalHoneycombConfigurationRepository.add(
      addGlobalHoneycombFeeDTO.getGlobalHoneycombFee(),
    );
    await this.slackService.publishMessage({
      message: `${addGlobalHoneycombFeeDTO.getEmail()} updated global configuration`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    });

    return true;
  }

  async fetchLatestConfiguration(isMobilePlatform: boolean) {
    const globalConfiguration = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();
    // After Mobile Promotion , we will remove this logic
    if (isMobilePlatform) {
      globalConfiguration['configuration']['ACH']['feeCap'] = 0;
      globalConfiguration['configuration']['ACH']['transactionFeeVarriable'] = 0;
      globalConfiguration['configuration']['HYBRID']['feeCap'] = 0;
      globalConfiguration['configuration']['HYBRID']['transactionFeeVarriable'] = 0;
      globalConfiguration['configuration']['CREDITCARD']['feeCap'] = 0;
      globalConfiguration['configuration']['CREDITCARD']['transactionFeeVarriable'] = 0;
    }
    return globalConfiguration;
  }
}

export default GlobalHoneycombConfigurationService;
