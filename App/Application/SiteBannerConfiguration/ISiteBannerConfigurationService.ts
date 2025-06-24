import AddSiteBannerConfigurationDTO from '@application/SiteBannerConfiguration/AddSiteBannerConfigurationDTO';

export const ISiteBannerConfigurationServiceId = Symbol.for(
  'ISiteBannerConfigurationService',
);

export interface ISiteBannerConfigurationService {
  addSiteBannerConfiguration(
    addSiteBannerConfigurationDTO: AddSiteBannerConfigurationDTO,
  ): Promise<boolean>;

  fetchLatestConfiguration(): Promise<any>;
}
