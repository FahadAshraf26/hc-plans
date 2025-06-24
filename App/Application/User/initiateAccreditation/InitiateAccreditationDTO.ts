class InitiateAccreditationDTO {
  userId: string;
  clientIp: string;

  constructor(userId: string, clientIp: string) {
    this.userId = userId;
    this.clientIp = clientIp;
  }

  UserId(): string {
    return this.userId;
  }

  getIP(): string {
    return this.clientIp;
  }
}

export default InitiateAccreditationDTO;
