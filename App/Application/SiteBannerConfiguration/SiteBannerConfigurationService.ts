import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import {
  ISiteBannerConfigurationRepository,
  ISiteBannerConfigurationRepositoryId,
} from '@domain/Core/SiteBannerConfiguration/ISiteBannerConfigurationRepository';
import AddSiteBannerConfigurationDTO from '@application/SiteBannerConfiguration/AddSiteBannerConfigurationDTO';
import { ISiteBannerConfigurationService } from '@application/SiteBannerConfiguration/ISiteBannerConfigurationService';
import config from '@infrastructure/Config';

const { slackConfig } = config;
@injectable()
class SiteBannerConfigurationService implements ISiteBannerConfigurationService {
  constructor(
    @inject(ISiteBannerConfigurationRepositoryId)
    private siteBannerConfigurationRepository: ISiteBannerConfigurationRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async addSiteBannerConfiguration(
    addSiteBannerDTO: AddSiteBannerConfigurationDTO,
  ): Promise<boolean> {
    await this.siteBannerConfigurationRepository.add(
      addSiteBannerDTO.getSiteBannerConfiguration(),
    );
    await this.slackService.publishMessage({
      message: `${addSiteBannerDTO.getEmail()} updated site banner configuration`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    });

    return true;
  }

  async fetchLatestConfiguration() {
    return this.siteBannerConfigurationRepository.fetchLatestRecord();
  }
}

export default SiteBannerConfigurationService;
