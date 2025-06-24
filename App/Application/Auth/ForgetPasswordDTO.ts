class ForgetPasswordDTO {
  private readonly email: string;
  private readonly recaptchaToken: string;
  private readonly platform: string;

  constructor(email: string, recaptchaToken: string, platform: string = 'web') {
    this.email = email;
    this.recaptchaToken = recaptchaToken;
    this.platform = platform;
  }

  /**
   *
   * @return {string}
   */
  getEmail() {
    return this.email;
  }

  getRecaptchaToken() {
    return this.recaptchaToken;
  }
  getPlatform() {
    return this.platform;
  }
}

export default ForgetPasswordDTO;
