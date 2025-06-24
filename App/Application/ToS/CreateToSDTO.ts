import ToS from '../../Domain/Core/ToS/ToS';

class CreateToSDTO {
  private tos: ToS;

  constructor(
    termOfServicesUpdateDate: boolean,
    privacyPolicyUpdateDate: boolean,
    educationalMaterialUpdateDate: boolean,
    faqsUpdateDate: boolean,
  ) {
    this.tos = ToS.createFromDetail(
      termOfServicesUpdateDate,
      privacyPolicyUpdateDate,
      educationalMaterialUpdateDate,
      faqsUpdateDate,
    );
  }

  getToS(): ToS {
    return this.tos;
  }
}

export default CreateToSDTO;
