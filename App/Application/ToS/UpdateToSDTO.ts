import ToS from '../../Domain/Core/ToS/ToS';

class UpdateToSDTO {
  private tos: ToS;

  constructor(tosObj) {
    this.tos = ToS.createFromObject(tosObj);
  }

  getToS() {
    return this.tos;
  }

  getToSId() {
    return this.tos.tosId;
  }
}
export default UpdateToSDTO;
