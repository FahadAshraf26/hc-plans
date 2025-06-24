export default class PlaidIdvRequestUserDTO {
  private userId: string;
  private email: string;
  private firstName?: string;
  private lastName?: string;
  private phoneNumber?: string;
  private address?: string;
  private city?: string;
  private state?: string;
  private zipCode?: string;
  private country?: string;
  private ssn?: string;
  private dob?: string;

  constructor(data: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    ssn?: string;
    dob?: string;
  }) {
    const trim = (val?: string) => typeof val === 'string' ? val.trim() : undefined;

    this.userId = trim(data.userId)!;
    this.email = trim(data.email)!;
    this.firstName = trim(data.firstName);
    this.lastName = trim(data.lastName);
    this.phoneNumber = trim(data.phoneNumber);
    this.address = trim(data.address);
    this.city = trim(data.city);
    this.state = trim(data.state);
    this.zipCode = trim(data.zipCode);
    this.country = trim(data.country);
    this.ssn = trim(data.ssn);
    this.dob = trim(data.dob);
  }

  private nonEmpty(val?: string) {
    return val !== undefined && val !== '';
  }

  public toPlaidUser() {
    const userData: any = {
      email_address: this.email
    };

    if (this.nonEmpty(this.firstName) && this.nonEmpty(this.lastName)) {
      userData.name = {
        ...(this.nonEmpty(this.firstName) && { given_name: this.firstName }),
        ...(this.nonEmpty(this.lastName) && { family_name: this.lastName }),
      };
    }

    if (this.nonEmpty(this.dob)) {
      userData.date_of_birth = this.dob;
    }

    if (this.nonEmpty(this.phoneNumber)) {
      userData.phone_number = '+1' + this.phoneNumber;
    }

    const hasAddressFields = ['address', 'city', 'state', 'zipCode'].every(
      (field) => this.nonEmpty((this as any)[field])
    );

    if (hasAddressFields) {
      userData.address = {
        ...(this.nonEmpty(this.address) && { street: this.address }),
        ...(this.nonEmpty(this.city) && { city: this.city }),
        ...(this.nonEmpty(this.state) && { region: this.state }),
        ...(this.nonEmpty(this.zipCode) && { postal_code: this.zipCode }),
        country: this.country || 'US'
      };
    }

    if (this.nonEmpty(this.ssn)) {
      userData.id_number = {
        value: this.ssn,
      };
    }
    return userData;
  }

  public getUserId(): string {
    return this.userId;
  }
}
