export default class FetchEntityAccreditationByIssuerIdDTO {
  private _issuerId: string;

  constructor(issuerId: string) {
    this._issuerId = issuerId;
  }

  get issuerId(): string {
    return this._issuerId;
  }

  static create(issuerId: string) {
    return new FetchEntityAccreditationByIssuerIdDTO(issuerId);
  }
}
