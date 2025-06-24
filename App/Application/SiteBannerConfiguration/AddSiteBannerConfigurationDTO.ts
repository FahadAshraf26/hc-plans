import SiteBannerConfiguration from '@domain/Core/SiteBannerConfiguration/SiteBannerConfiguration';

class AddSiteBannerConfigurationDTO {
  private readonly siteBannerConfiguration: SiteBannerConfiguration;
  private readonly email: string;

  constructor(email: string, configuration: any) {
    this.siteBannerConfiguration = SiteBannerConfiguration.createFromDetail(
      configuration,
    );
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  getSiteBannerConfiguration() {
    return this.siteBannerConfiguration;
  }
}

export default AddSiteBannerConfigurationDTO;
