export default class UpdateEntityAccreditationDTO {
  private _issuerId: string;
  private _annualIncome: number;
  private _netWorth: number;
  constructor(annualIncome: number, netWorth: number, issuerId: string) {
    this._issuerId = issuerId;
    this._annualIncome = annualIncome;
    this._netWorth = netWorth;
  }

  get issuerId(): string {
    return this._issuerId;
  }

  get annualIncome(): number {
    return this._annualIncome;
  }

  get netWorth(): number {
    return this._netWorth;
  }

  static create(annualIncome: number, netWorth: number, issuerId: string) {
    return new UpdateEntityAccreditationDTO(annualIncome, netWorth, issuerId);
  }
}
