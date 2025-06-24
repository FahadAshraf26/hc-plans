class UpdateFcmTokenDTO {
  private readonly userId: string;
  private readonly fcmToken: string;
  
  constructor(userId: string, fcmToken: string) {
    this.userId = userId;
    this.fcmToken = fcmToken;
  }
  
  getFcmToken() {
    return this.fcmToken;
  }

  getUserId() {
    return this.userId;
  }
}

export default UpdateFcmTokenDTO;
