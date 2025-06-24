import NAIC from '../../Domain/Core/NAIC/NAIC';

class CreateNAICDTO {
  private readonly naic: NAIC;

  constructor(code: number, title: string) {
    this.naic = NAIC.createFromDetail(code, title);
  }

  getNAIC() {
    return this.naic;
  }
}

export default CreateNAICDTO;
