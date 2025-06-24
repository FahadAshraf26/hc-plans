class DwollaCustomerDTO {
  private FIRST_NAME: string;

  constructor(data: any) {
    this.FIRST_NAME = data.user.issuerName || data.user.firstName;
  }
}

export default DwollaCustomerDTO;
