class UploadRepaymentsDTO {
  public file: any;
  public email: string;

  constructor(file: any, email: string) {
    this.file = file;
    this.email = email;
  }
}

export default UploadRepaymentsDTO;
