import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class SiteBannerConfiguration extends BaseEntity {
  siteBannerConfigurationId: string;
  private configuration: any;

  constructor({ siteBannerConfigurationId, configuration }) {
    super();
    this.siteBannerConfigurationId = siteBannerConfigurationId;
    this.configuration = configuration;
  }

  static createFromObj(siteBannerConfigurationObj) {
    const siteBannerConfiguration = new SiteBannerConfiguration(
      siteBannerConfigurationObj,
    );
    if (siteBannerConfigurationObj.createdAt) {
      siteBannerConfiguration.setCreatedAt(siteBannerConfigurationObj.createdAt);
    }
    if (siteBannerConfigurationObj.updatedAt) {
      siteBannerConfiguration.setUpdatedAt(siteBannerConfigurationObj.updatedAt);
    }
    if (siteBannerConfigurationObj.deletedAt) {
      siteBannerConfiguration.setDeletedAT(siteBannerConfigurationObj.deletedAt);
    }

    return siteBannerConfiguration;
  }

  static createFromDetail(configuration) {
    return new SiteBannerConfiguration({
      siteBannerConfigurationId: uuid(),
      configuration,
    });
  }
}

export default SiteBannerConfiguration;
