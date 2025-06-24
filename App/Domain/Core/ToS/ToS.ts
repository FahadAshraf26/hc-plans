import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class ToS extends BaseEntity {
  tosId: string;
  termOfServicesUpdateDate: Date | boolean;
  privacyPolicyUpdateDate: Date | boolean;
  educationalMaterialUpdateDate: Date | boolean;
  faqsUpdateDate: Date | boolean;

  constructor(
    tosId: string,
    termOfServicesUpdateDate: Date | boolean,
    privacyPolicyUpdateDate: Date | boolean,
    educationalMaterialUpdateDate: Date | boolean,
    faqsUpdateDate: Date | boolean,
  ) {
    super();
    this.tosId = tosId;
    this.termOfServicesUpdateDate = termOfServicesUpdateDate;
    this.privacyPolicyUpdateDate = privacyPolicyUpdateDate;
    this.educationalMaterialUpdateDate = educationalMaterialUpdateDate;
    this.faqsUpdateDate = faqsUpdateDate;
  }

  /**
   * Create ToS Object
   * @param {object} tosObj
   * @returns ToS
   */
  static createFromObject(tosObj): ToS {
    const tos = new ToS(
      tosObj.tosId,
      tosObj.termOfServicesUpdateDate,
      tosObj.privacyPolicyUpdateDate,
      tosObj.educationalMaterialUpdateDate,
      tosObj.faqsUpdateDate,
    );

    if (tosObj.createdAt) {
      tos.setCreatedAt(tosObj.createdAt);
    }

    if (tosObj.updatedAt) {
      tos.setUpdatedAt(tosObj.updatedAt);
    }

    if (tosObj.deletedAt) {
      tos.setDeletedAT(tosObj.deletedAt);
    }

    return tos;
  }

  /**
   * Create ToS Object with Id
   * @param {boolean} termOfServicesUpdateDate
   * @param {boolean} privacyPolicyUpdateDate
   * @param {boolean} educationalMaterialUpdateDate
   * @param {boolean} faqsUpdateDate
   * @returns ToS
   */
  static createFromDetail(
    termOfServicesUpdateDate = false,
    privacyPolicyUpdateDate = false,
    educationalMaterialUpdateDate = false,
    faqsUpdateDate = false,
  ): ToS {
    return new ToS(
      uuid(),
      termOfServicesUpdateDate,
      privacyPolicyUpdateDate,
      educationalMaterialUpdateDate,
      faqsUpdateDate,
    );
  }
}

export default ToS;
