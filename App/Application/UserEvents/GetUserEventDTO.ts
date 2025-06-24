class GetUserEventDTO {
  private readonly eventName: string;
  private readonly userId: string;

  constructor(userId: string, eventName: string) {
    this.eventName = eventName;
    this.userId = userId;
  }

  getEventName() {
    return this.eventName;
  }

  getUserId() {
    return this.userId;
  }
}

export default GetUserEventDTO;
