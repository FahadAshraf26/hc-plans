class InitiateBiometricVerificationDTO {
  private readonly userId: string;
  private readonly biometricSignatureKey: string;

  constructor(userId: string, biometricSignatureKey: string) {
    this.userId = userId;
    this.biometricSignatureKey = biometricSignatureKey;
  }

  getUserId() {
    return this.userId;
  }

  getBiometricSignatureKey() {
    return this.biometricSignatureKey;
  }
}

export default InitiateBiometricVerificationDTO;
