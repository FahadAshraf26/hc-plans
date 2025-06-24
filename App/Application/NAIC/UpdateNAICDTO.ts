import NAIC from '../../Domain/Core/NAIC/NAIC';

class UpdateNAICDTO {
  private readonly naic: NAIC;

  constructor(naicObj: any) {
    this.naic = NAIC.createFromObject(naicObj);
    if (naicObj.naicId) {
      this.naic.setId(naicObj.naicId);
    }
  }

  getNAIC() {
    return this.naic;
  }

  setId(naicId) {
    return this.naic.setId(naicId);
  }

  getNAICId() {
    return this.naic.naicId;
  }
}

export default UpdateNAICDTO;
