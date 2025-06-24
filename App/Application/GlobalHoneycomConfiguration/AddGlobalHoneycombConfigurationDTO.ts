import GlobalHoneycombConfiguration from '@domain/Core/GlobalHoneycombConfiguration/GlobalHoneycombConfiguration';

class AddGlobalHoneycombConfigurationDTO {
  private readonly globalHoneycombFee: GlobalHoneycombConfiguration;
  private readonly email: string;

  constructor(email: string, configuration: any) {
    this.globalHoneycombFee = GlobalHoneycombConfiguration.createFromDetail(
      configuration,
    );
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  getGlobalHoneycombFee() {
    return this.globalHoneycombFee;
  }
}

export default AddGlobalHoneycombConfigurationDTO;
