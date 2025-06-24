import { inject, injectable } from 'inversify';
import {
  IGlobalHoneycombConfigurationService,
  IGlobalHoneycombConfigurationServiceId,
} from '@application/GlobalHoneycomConfiguration/IGlobalHoneycombConfigurationService';
import AddGlobalHoneycombConfigurationDTO from '@application/GlobalHoneycomConfiguration/AddGlobalHoneycombConfigurationDTO';

@injectable()
class GlobalHoneycombConfigurationController {
  constructor(
    @inject(IGlobalHoneycombConfigurationServiceId)
    private globalHoneycombFeeService: IGlobalHoneycombConfigurationService,
  ) {}

  addGlobalHoneycombFee = async (req, res) => {
    const input = new AddGlobalHoneycombConfigurationDTO(req.adminUser.email, req.body);
    await this.globalHoneycombFeeService.addHoneycombFee(input);
    return {
      body: {
        status: 'success',
        message: 'Honeycomb Configuration Updated Successfully',
      },
    };
  };

  fetchGlobalHoneycombConfiguration = async (req, res) => {
    const platform = req.headers['req-platform'];
    const isMobilePlatform = platform === 'mobile'
    const configuration = await this.globalHoneycombFeeService.fetchLatestConfiguration(isMobilePlatform);
    return {
      body: {
        status: 'success',
        data: configuration,
      },
    };
  };
}

export default GlobalHoneycombConfigurationController;
