import InvestorIncomeDetailsNotSubmittedException from '../Exceptions/Investors/InvestorIncomeDetailsNotSubmittedException';
import User from '@domain/Core/User/User';

class InvestmentLimitService {
  private user: User;
  private investments: any;

  constructor(user, investments) {
    this.user = user;
    this.investments = investments;
  }

  static createFromDetails(user, investments) {
    return new InvestmentLimitService(user, investments);
  }

  getInvestLimitAvailableDate(date = new Date()) {
    const sortInvestmentsByDate = this.investments;
    // .map((investment) => ({
    //   ...investment,
    //   createdAt: new Date(investment.createdAt),
    // })) // make createdAt date object
    // .filter(
    //   (investment) =>
    //     investment.createdAt > new Date(date).setFullYear(date.getFullYear() - 1),
    // ) // filter investments by date
    // .sort((a, b) => {
    //   return a.createdAt - b.createdAt;
    // });

    const totalInvested = sortInvestmentsByDate.reduce(
      (sum, { amount }) => sum + amount,
      0,
    );

    const oldestInvestment = sortInvestmentsByDate[0];
    const investmentCap: any = this.user.investor.calculateInvestmentCap();
    const userProvidedInvestmentDate: any = this.user.investor
      .userProvidedCurrentInvestmentsDate
      ? new Date(this.user.investor.userProvidedCurrentInvestmentsDate)
      : null;
    const userProvidedInvestments = this.user.investor.userProvidedCurrentInvestments;

    if (!oldestInvestment && investmentCap > 100) {
      return false;
    }

    if (investmentCap - totalInvested > 100) {
      return false;
    }

    if (!oldestInvestment && investmentCap === 0) {
      if (!userProvidedInvestmentDate && !userProvidedInvestments) {
        throw new InvestorIncomeDetailsNotSubmittedException();
      }
      // means investor's investment outside of app fill their cap
      // userProvidedInvestmentDate.setFullYear(
      //   userProvidedInvestmentDate.getFullYear() + 1,
      // ); //date when this investment expires
      // userProvidedInvestmentDate.getDate(userProvidedInvestmentDate.getDate() + 1);
      // return userProvidedInvestmentDate;
    }

    // get the bigger date of the two
    // const biggerDate = !userProvidedInvestmentDate
    //   ? oldestInvestment.createdAt
    //   : oldestInvestment.createdAt > userProvidedInvestmentDate
    //   ? oldestInvestment.createdAt
    //   : userProvidedInvestmentDate;

    // const dateWhenLastInvestmentExpires: any = new Date(biggerDate);
    // dateWhenLastInvestmentExpires.setFullYear(biggerDate.getFullYear() + 1); //date when this investment expires
    // dateWhenLastInvestmentExpires.getDate(dateWhenLastInvestmentExpires.getDate() + 1);
    const expirationDate = oldestInvestment.createdAt
      ? new Date(oldestInvestment.createdAt)
      : new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    return expirationDate;
  }
}

export default InvestmentLimitService;
