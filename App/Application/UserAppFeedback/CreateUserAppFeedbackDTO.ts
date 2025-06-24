import UserAppFeedback from '../../Domain/Core/UserAppFeedBack/UserAppFeedback';

class CreateUserAppFeedbackDTO {
  private userAppFeedback: UserAppFeedback;

  constructor(userId, rating, text) {
    this.userAppFeedback = UserAppFeedback.createFromDetail(userId, rating, text);
  }

  getUserAppFeedback(): UserAppFeedback {
    return this.userAppFeedback;
  }
}

export default CreateUserAppFeedbackDTO;
