import { inject, injectable } from 'inversify';
import {
  ISiteBannerConfigurationService,
  ISiteBannerConfigurationServiceId,
} from '@application/SiteBannerConfiguration/ISiteBannerConfigurationService';
import AddSiteBannerConfigurationDTO from '@application/SiteBannerConfiguration/AddSiteBannerConfigurationDTO';

@injectable()
class SiteBannerConfigurationController {
  constructor(
    @inject(ISiteBannerConfigurationServiceId)
    private siteBannerConfigurationService: ISiteBannerConfigurationService,
  ) {}

  addSiteBannerConfiguration = async (req, res) => {
    const input = new AddSiteBannerConfigurationDTO(req.adminUser.email, req.body);
    await this.siteBannerConfigurationService.addSiteBannerConfiguration(input);
    return {
      body: {
        status: 'success',
        message: 'Honeycomb Site Banner Configuration Updated Successfully',
      },
    };
  };

  fetchSiteBannerConfiguration = async (req, res) => {
    const configuration = await this.siteBannerConfigurationService.fetchLatestConfiguration();
    return {
      body: {
        status: 'success',
        data: configuration,
      },
    };
  };
}

export default SiteBannerConfigurationController;
