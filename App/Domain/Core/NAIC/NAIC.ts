import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class NAIC extends BaseEntity {
  private code: number;
  private title: string;
  naicId: string;

  constructor(code: number, title: string) {
    super();
    this.code = code;
    this.title = title;
  }

  setId(naicId: string) {
    this.naicId = naicId;
  }

  /**
   *
   * @param {object} naicObj
   * @returns NAIC
   */
  static createFromObject(naicObj) {
    const naic = new NAIC(naicObj.code, naicObj.title);

    if (naicObj.naicId) {
      naic.setId(naicObj.naicId);
    }

    if (naicObj.createdAt) {
      naic.setCreatedAt(naicObj.createdAt);
    }

    if (naicObj.updatedAt) {
      naic.setUpdatedAt(naicObj.updatedAt);
    }

    return naic;
  }

  /**
   *
   * @param {string} code
   * @returns NAIC
   */
  static createFromDetail(code, title) {
    return new NAIC(code, title);
  }
}

export default NAIC;
