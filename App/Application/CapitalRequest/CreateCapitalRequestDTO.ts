import CapitalRequest from '../../Domain/Core/CapitalRequest/CapitalRequest';

class CapitalRequestDTO {
  userId: string;
  capitalRequest: CapitalRequest;

  constructor(
    userId: string,
    businessName: string,
    state: string,
    description: string,
    capitalRequired: string,
    capitalReason: string,
  ) {
    this.userId = userId;
    this.capitalRequest = CapitalRequest.createFromDetail(
      userId,
      businessName,
      state,
      description,
      capitalRequired,
      capitalReason,
    );
  }

  getCapitalRequest() {
    return this.capitalRequest;
  }

  getUserId() {
    return this.userId;
  }
}

export default CapitalRequestDTO;
