export const ICampaignEventsId = Symbol.for('ICampaignEvents');
export interface ICampaignEvents {
  handleEvents({ fundsService, goalsReached }): Promise<any>;
  // sendEntityInvestmentReceipt({
  //   user,
  //   entity,
  //   campaign,
  //   campaignName1,
  //   campaignName2,
  //   fee,
  //   feePercentage,
  //   fee2,
  //   feePercentage2,
  //   amountToCharge,
  //   amount1,
  //   amount2,
  // }): Promise<any>;
  sendInvestmentReceipt({
    user,
    campaign,
    campaignName1,
    campaignName2,
    fee,
    feePercentage,
    fee2,
    feePercentage2,
    amountToCharge,
    amount1,
    amount2,
  }): Promise<any>;
  sendIssuerInvestmentReceipt({
    issuer,
    user,
    campaignFund,
    totalInvestments,
  }): Promise<any>;
  sendEmailsToInvestors({
    dto,
    user,
    campaign,
    fee,
    feePercentage,
    transactionAmount,
    walletAmount,
    fixedFee,
  }): Promise<any>;
}
