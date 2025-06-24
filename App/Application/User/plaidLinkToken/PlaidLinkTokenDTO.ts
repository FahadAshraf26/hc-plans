class PlaidLinkTokenDTO {
  private readonly userId: string;
  private readonly investorId?: string;
  private readonly _isUpdateMode?: string;
  private readonly redirect_uri?: string;
  private readonly android_package_name?: string;

  constructor(userId: string, investorId?: string, isUpdateMode: string = 'false', redirect_uri: string = '', android_package_name: string = '' ) {
    this.userId = userId;
    this.investorId = investorId;
    this._isUpdateMode = isUpdateMode;
    this.redirect_uri = redirect_uri;
    this.android_package_name = android_package_name;
  }

  UserId() {
    return this.userId;
  }

  InvestorId() {
    return this.investorId;
  }

  isUpdateMode() {
    return this._isUpdateMode === 'true';
  }

  redirectUri() {
    return this.redirect_uri;
  }

  androidPackageName() {
    return this.android_package_name;
  }
}

export default PlaidLinkTokenDTO;
