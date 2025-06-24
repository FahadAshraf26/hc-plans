import { UserType } from '../Core/ValueObjects/UserType';
import User from '../Core/User/User';

class UserTypeService {
  user: User;
  investment: number;

  constructor(user, totalInvestmet = 0) {
    this.user = user;
    this.investment = totalInvestmet;
  }

  static createFromUser(user, totalInvestmet = 0) {
    return new UserTypeService(user, totalInvestmet);
  }

  getUserType() {
    if (this.user.isPersonalInformationSubmitted() && this.user.isUserVerified()) {
      if (this.investment > 0 && this.investment < 500) {
        return UserType.ACTIVE_INVESTOR;
      }
      if (this.investment >= 500) {
        return UserType.POWER_INVESTOR;
      }
      return UserType.INVESTOR;
    }
    return UserType.SIGN_UP;
  }

  getAccreditationStatus() {
    if (this.user.investor) {
      return this.user.investor.getAccreditationStatus();
    }
    return false;
  }
}

export default UserTypeService;
