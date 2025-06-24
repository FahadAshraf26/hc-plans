import sha256 from 'sha256';
import config from '@infrastructure/Config';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
const { usaepay } = config;

class USAEPayService {
  private client;
  constructor(client) {
    this.client = client;
  }

  generateFirstCitizenBankAuthorization = () => {
    const seed = usaepay.firstCitizenBank.SEED;
    const apikey = usaepay.firstCitizenBank.API_KEY;
    const apipin = usaepay.firstCitizenBank.PIN;
    const prehash = apikey + seed + apipin;
    const apihash = 's2/' + seed + '/' + sha256(prehash);
    return Buffer.from(apikey + ':' + apihash).toString('base64');
  };

  generateThreadBankAuthorization = () => {
    const seed = usaepay.threadBank.SEED;
    const apikey = usaepay.threadBank.API_KEY;
    const apipin = usaepay.threadBank.PIN;
    const prehash = apikey + seed + apipin;
    const apihash = 's2/' + seed + '/' + sha256(prehash);
    return Buffer.from(apikey + ':' + apihash).toString('base64');
  };

  createCustomerInput(user) {
    const {
      firstName,
      lastName,
      userId,
      address,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      email,
    } = user;
    return {
      first_name: firstName,
      last_name: lastName,
      customerid: userId,
      street: address,
      city,
      state,
      postalcode: zipCode,
      country,
      phone: phoneNumber,
      email,
    };
  }

  async createFirstCitizenBankCustomer(user) {
    const input = this.createCustomerInput(user);
    const result = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/customers',
      data: input,
      authorizationHeaders: this.generateFirstCitizenBankAuthorization(),
    });
    return { customerKey: result.key, customerId: result.custid };
  }

  async createThreadBankCustomer(user) {
    const input = this.createCustomerInput(user);
    const result = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/customers',
      data: input,
      authorizationHeaders: this.generateThreadBankAuthorization(),
    });
    return { customerKey: result.key, customerId: result.custid };
  }

  createCustomerBankInput(firstName, lastName, bankInfo) {
    return [
      {
        method_name: `${firstName} ${lastName}`,
        cardholder: `${firstName} ${lastName}`,
        account: bankInfo.accountNumber,
        routing: bankInfo.routingNumber,
        account_type: bankInfo.accountType,
        account_format: 'WEB',
        pay_type: 'check',
        default: false,
        sortord: 2,
      },
    ];
  }

  async attachCustomerFirstCitizenBankAccount(
    firstName: string,
    lastName: string,
    bankInfo,
    customerKey,
  ) {
    const input = this.createCustomerBankInput(firstName, lastName, bankInfo);
    const url = `/customers/${customerKey}/payment_methods`;
    await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url,
      data: input,
      authorizationHeaders: this.generateFirstCitizenBankAuthorization(),
    });
    return true;
  }

  async attachCustomerThreadBankAccount(
    firstName: string,
    lastName: string,
    bankInfo,
    customerKey,
  ) {
    const input = this.createCustomerBankInput(firstName, lastName, bankInfo);
    const url = `/customers/${customerKey}/payment_methods`;
    await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url,
      data: input,
      authorizationHeaders: this.generateThreadBankAuthorization(),
    });
    return true;
  }

  async getCustomerBank(customerKey, escrowType) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.GET,
      url: `/customers/${customerKey}/payment_methods`,
      authorizationHeaders:
        escrowType === CampaignEscrow.FIRST_CITIZEN_BANK
          ? this.generateFirstCitizenBankAuthorization()
          : this.generateThreadBankAuthorization(),
    });
    return res;
  }

  async externalFundMovementInput(
    campaign,
    amount,
    firstName,
    lastName,
    vcCustomerKey,
    vcThreadBankCustomerKey,
    bank,
  ) {
    const customerKey =
      campaign.escrowType === CampaignEscrow.FIRST_CITIZEN_BANK
        ? vcCustomerKey
        : vcThreadBankCustomerKey;
    const res = await this.getCustomerBank(customerKey, campaign.escrowType);
    return {
      command: 'check:sale',
      amount,
      custkey: customerKey,
      check: {
        accountholder: `${firstName} ${lastName}`,
        routing: bank.routingNumber,
        account: bank.accountNumber,
        format: 'WEB',
        number: campaign.campaignId,
      },
      description: `investment in ${campaign.campaignName}`,
      custom_fields: [`${campaign.campaignId}`, `${campaign.campaignName}`],
      save_customer_paymethod: res.data.length ? false : true,
    };
  }

  async externalFundMovement(
    campaign,
    amount,
    firstName,
    lastName,
    vcCustomerKey,
    vcThreadBankCustomerKey,
    bank,
  ) {
    try {
      const input = await this.externalFundMovementInput(
        campaign,
        amount,
        firstName,
        lastName,
        vcCustomerKey,
        vcThreadBankCustomerKey,
        bank,
      );

      const result = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/transactions',
        data: input,
        authorizationHeaders:
          campaign.escrowType === CampaignEscrow.FIRST_CITIZEN_BANK
            ? this.generateFirstCitizenBankAuthorization()
            : this.generateThreadBankAuthorization(),
      });
      return { tradeId: result.key, referenceNumber: result.refnum };
    } catch (error) {
      throw new Error(error);
    }
  }

  async refundFund(tradeId, referenceNumber) {
    try {
      const data = {
        command: 'refund',
        trankey: tradeId,
        refnum: referenceNumber,
      };

      const { refnum, key } = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/transactions',
        data,
        authorizationHeaders: this.generateFirstCitizenBankAuthorization(),
      });

      return { refnum, key };
    } catch (error) {
      throw new Error(error);
    }
  }

  async voidTransaction(tradeId) {
    try {
      const data = {
        command: 'void',
        trankey: tradeId,
      };

      await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/transactions',
        data,
        authorizationHeaders: this.generateFirstCitizenBankAuthorization(),
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchTransactionDetail(transactionId: string, source: string) {
    const response = await this.client.sendRequest({
      httpVerb: this.client.VERBS.GET,
      url: `/transactions/${transactionId}`,
      authorizationHeaders:
        source === CampaignEscrow.FIRST_CITIZEN_BANK
          ? this.generateFirstCitizenBankAuthorization()
          : this.generateThreadBankAuthorization(),
    });
    return response;
  }

  async fetchCustomersList() {
    try {
      const response = await this.client.sendRequest({
        httpVerb: this.client.VERBS.GET,
        url: `/customers?limit=443&offset=0`,
        authorizationHeaders: this.generateThreadBankAuthorization(),
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCustomer(custKey) {
    try {
      const response = await this.client.sendRequest({
        httpVerb: this.client.VERBS.DELETE,
        url: `/customers/${custKey}`,
        authorizationHeaders: this.generateThreadBankAuthorization(),
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default USAEPayService;
