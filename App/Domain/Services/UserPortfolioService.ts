import moment from 'moment';
import roundTo from '@infrastructure/Utils/roundTo';

type UserPortfolio = {
  totalCommitted: number;
  successfulInvested: number;
  totalDebtInvested: number;
  totalEquityInvested: number;
  totalRevShareInvested: number;
  totalConvertibleNoteInvested: number;
  investmentLimit: string;
  totalInvestedWithFee: number;
  totalInvestorRepaid: number;
  projectedReturns: number;
  nextPaymentInDays: number;
  nextPaymentAmount: number;
  principleLeft: number;
  principleForgivenAmount: number;
  lastUpdateDate: string;
  jobSupported: number;
  totalSafeInvested: number;
  totalEquityLLCInvested: number;
  totalSafeDiscountInvested: number;
  totalBusinesses: number;
  totalDebtAndRevInvestment: number;
  totalEquityAndConvertibleAndSafeInvestment: number;
  totalPendingDebtAndRevInvested: number;
  totalPendingEquityConveritbleSafeInvestments: number;
};

type Investments = {
  totalCommitted: number;
  successfulInvested: number;
  totalDebtInvested: number;
  totalEquityInvested: number;
  totalRevShareInvested: number;
  totalConvertibleNoteInvested: number;
  totalSafeDiscountInvested: number;
  totalSafeInvested: number;
  totalEquityLLCInvested: number;
  totalPendingDebtAndRevInvested: number;
  totalPendingEquityConveritbleSafeInvestments: number;
};

type PortfolioData = {
  totalInvested: number;
  totalInvestedWithoutFee: number;
  totalRepaid: number;
  nextPaymentDate: number;
  nextPaymentAmount: number;
  projectionReturns: number;
  totalPrinciple: number;
  totalDebtInvested: number;
  totalEquityInvested: number;
  principleForgivenAmount: number;
  totalRevShareInvested: number;
};

class UserPortfolioService {
  private investments: Investments;
  private portfolioData: PortfolioData;
  private lastUpdate: Date;
  private investmentLimit: string;
  private jobSupported: number;
  private totalBusinesses: number;

  constructor(
    investments: Investments,
    portfolioData: PortfolioData,
    lastUpdate: Date,
    investmentLimit: string,
    jobSupported: number,
    totalBusinesses: number,
  ) {
    this.investments = investments;
    this.portfolioData = portfolioData;
    this.lastUpdate = lastUpdate;
    this.investmentLimit = investmentLimit;
    this.jobSupported = jobSupported;
    this.totalBusinesses = totalBusinesses;
  }

  static createFromDetails(
    investments,
    portfolioData,
    lastUpdate,
    investmentLimit,
    jobsSupported,
    totalBusinesses,
  ) {
    return new UserPortfolioService(
      investments,
      portfolioData,
      lastUpdate,
      investmentLimit,
      jobsSupported,
      totalBusinesses,
    );
  }

  getInvestorPortfolio(): UserPortfolio {
    const {
      totalCommitted,
      successfulInvested,
      totalDebtInvested,
      totalEquityInvested,
      totalRevShareInvested,
      totalConvertibleNoteInvested,
      totalSafeInvested,
      totalEquityLLCInvested,
      totalSafeDiscountInvested,
      totalPendingDebtAndRevInvested,
      totalPendingEquityConveritbleSafeInvestments,
    } = this.investments;
    const {
      totalInvestedWithoutFee,
      totalRepaid,
      projectionReturns,
      nextPaymentDate,
      nextPaymentAmount,
      totalPrinciple,
      totalInvested,
      principleForgivenAmount,
    } = this.portfolioData;

    const dateToFilterBy = new Date();
    dateToFilterBy.setMonth(dateToFilterBy.getMonth() - 12);
    const totalPrincipleRepaid = totalPrinciple > 0 ? roundTo(totalPrinciple, 1) : 0;
    const totalDebt = totalDebtInvested > 0 ? roundTo(totalDebtInvested, 2) : 0;
    const totalRev = totalRevShareInvested > 0 ? roundTo(totalRevShareInvested, 2) : 0;
    const totalEquity = totalEquityInvested > 0 ? roundTo(totalEquityInvested, 2) : 0;
    const totalConveritbleNote =
      totalConvertibleNoteInvested > 0 ? roundTo(totalConvertibleNoteInvested, 2) : 0;
    const totalSafe = totalSafeInvested > 0 ? roundTo(totalSafeInvested, 2) : 0;
    const totalEquityLLC =
      totalEquityLLCInvested > 0 ? roundTo(totalEquityLLCInvested, 2) : 0;
    const totalSafeDiscount =
      totalSafeDiscountInvested > 0 ? roundTo(totalSafeDiscountInvested, 2) : 0;
    const totalDebtAndRevInvestment = totalDebt + totalRev;
    const principleTotal =
      totalDebtAndRevInvestment > 0 ? roundTo(totalDebtAndRevInvestment, 2) : 0;

    const principalLeft = principleTotal - totalPrincipleRepaid - principleForgivenAmount;

    return {
      totalCommitted: totalCommitted > 0 ? totalCommitted : 0,
      successfulInvested: successfulInvested > 0 ? successfulInvested : 0,
      totalDebtInvested: totalDebt,
      totalEquityInvested: totalEquity,
      totalRevShareInvested: totalRev,
      totalConvertibleNoteInvested: totalConveritbleNote,
      totalInvestedWithFee: totalInvested > 0 ? roundTo(totalInvested, 2) : 0,
      totalInvestorRepaid: totalRepaid > 0 ? roundTo(totalRepaid, 2) : 0,
      projectedReturns: projectionReturns > 0 ? roundTo(projectionReturns, 2) : 0,
      nextPaymentInDays: nextPaymentDate,
      nextPaymentAmount: nextPaymentAmount > 0 ? roundTo(nextPaymentAmount, 2) : 0,
      principleLeft: roundTo(principalLeft, 2),
      principleForgivenAmount: principleForgivenAmount,
      investmentLimit: this.investmentLimit,
      lastUpdateDate: moment(this.lastUpdate).format('YYYY-MM-DD HH:mm:ss'),
      jobSupported: this.jobSupported,
      totalSafeInvested: totalSafe,
      totalEquityLLCInvested: totalEquityLLC,
      totalSafeDiscountInvested: totalSafeDiscount,
      totalBusinesses: this.totalBusinesses,
      totalDebtAndRevInvestment,
      totalEquityAndConvertibleAndSafeInvestment:
        totalEquity + totalConveritbleNote + totalSafe + totalSafeDiscount,
      totalPendingDebtAndRevInvested: totalPendingDebtAndRevInvested
        ? totalPendingDebtAndRevInvested
        : 0,
      totalPendingEquityConveritbleSafeInvestments: totalPendingEquityConveritbleSafeInvestments
        ? totalPendingEquityConveritbleSafeInvestments
        : 0,
    };
  }
}

export default UserPortfolioService;
