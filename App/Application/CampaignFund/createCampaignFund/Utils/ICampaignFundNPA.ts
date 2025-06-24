export const ICampaignFundNPAId = Symbol.for('ICampaignFundNPA');

export interface ICampaignFundNPA {
  execute(dto: any, user: any, campaign: any): Promise<any>;
  saveNPASignedDocument(user: any, campaign: any, amount: any, issuer: any,isEquity: boolean,isRevenueShare: boolean,isConvertibleNote:boolean): Promise<any>;
}
