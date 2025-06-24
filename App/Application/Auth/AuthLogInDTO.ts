class AuthLogInDTO {
  private readonly email: string;
  private readonly password: string;
  private readonly recaptchaToken: string;
  private readonly platform: string;

  constructor(
    email: string,
    password: string,
    recaptchaToken: string,
    platform: string = 'web',
  ) {
    this.email = email;
    this.password = password;
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

  /**
   *
   * @return {string}
   */
  getPassword() {
    return this.password;
  }

  getRecaptchaToken() {
    return this.recaptchaToken;
  }
  getPlatform() {
    return this.platform;
  }
}

export default AuthLogInDTO;
