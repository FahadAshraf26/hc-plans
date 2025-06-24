class UpdateBiometricInfoDTO {
  private readonly userId: string;
  private readonly isBiometricEnabled: boolean;
  private readonly biometricKey: string;

  constructor(userId: string, isBiometricEnabled: boolean, biometricKey: string) {
    this.userId = userId;
    this.isBiometricEnabled = isBiometricEnabled;
    this.biometricKey = biometricKey;
  }

  getIsBiometricEnabledToken() {
    return this.isBiometricEnabled;
  }

  getBiometricKey() {
    return this.biometricKey;
  }

  getUserId() {
    return this.userId;
  }
}

export default UpdateBiometricInfoDTO;
