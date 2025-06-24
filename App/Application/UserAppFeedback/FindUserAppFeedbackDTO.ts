class FindUserAppFeedbackDTO {
  userAppFeedbackId: string;

  constructor(userAppFeedbackId) {
    this.userAppFeedbackId = userAppFeedbackId;
  }

  getUserAppFeedbackId(): string {
    return this.userAppFeedbackId;
  }
}

export default FindUserAppFeedbackDTO;
