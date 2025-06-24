class HandleInvestReadyRedirectDTO {
  private readonly code: number;

  constructor(code: number) {
    this.code = code;
  }

  getCode() {
    return this.code;
  }
}

export default HandleInvestReadyRedirectDTO;
