import Issuer from '../../Domain/Core/Issuer/Issuer';

class UpdateIssuerDTO {
  private issuer: Issuer;
  private ownerIds: [];
  private ip: string;

  constructor(issuerObj) {
    this.issuer = Issuer.createFromObject(issuerObj);

    this.ownerIds = issuerObj.ownerIds || [];
    this.ip = issuerObj.ip ? issuerObj.ip : null;
  }

  getIP() {
    return this.ip;
  }

  getIssuerId() {
    return this.issuer.issuerId;
  }

  getIssuer() {
    return this.issuer;
  }

  getOwnerIds() {
    return this.ownerIds;
  }
}

export default UpdateIssuerDTO;
