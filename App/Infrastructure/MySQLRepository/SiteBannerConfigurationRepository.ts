import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import models from '@infrastructure/Model';
import SiteBannerConfiguration from '@domain/Core/SiteBannerConfiguration/SiteBannerConfiguration';
import { injectable } from 'inversify';
import { ISiteBannerConfigurationRepository } from '@domain/Core/SiteBannerConfiguration/ISiteBannerConfigurationRepository';

const { SiteBannerConfigurationModel } = models;

@injectable()
class SiteBannerConfigurationRepository extends BaseRepository
  implements ISiteBannerConfigurationRepository {
  constructor() {
    super(
      SiteBannerConfigurationModel,
      'siteBannerConfigurationId',
      SiteBannerConfiguration,
    );
  }

  async fetchLatestRecord() {
    const configuration = await SiteBannerConfigurationModel.findOne({
      order: [['createdAt', 'DESC']],
    });
    if (configuration) {
      return SiteBannerConfiguration.createFromObj(configuration);
    } else {
      return null;
    }
  }
}

export default SiteBannerConfigurationRepository;
