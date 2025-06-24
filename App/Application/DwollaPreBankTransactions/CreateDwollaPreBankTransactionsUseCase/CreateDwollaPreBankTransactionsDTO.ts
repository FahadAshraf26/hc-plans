class CreateDwollaPreBankTransactionsDTO {
  private readonly file: any;

  constructor(file: any) {
    this.file = file;
  }

  getFile() {
    return this.file;
  }
}

export default CreateDwollaPreBankTransactionsDTO;
