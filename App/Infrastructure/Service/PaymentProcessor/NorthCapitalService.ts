import User from '@domain/Core/User/User';
import TimeUtil from '../../Utils/TimeUtil';
import Issuer from '@domain/Core/Issuer/Issuer';
import config from '@infrastructure/Config';

const { server } = config;

class NorthCapitalService {
  private client;

  /**
   *
   * @param {NorthCapitalClient} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {User} user
   */
  createPartyInput(user: User) {
    const dob = user.dob
      ? TimeUtil.getUSDateString(new Date(user.dob).toISOString(), 'LL-dd-yyyy')
      : null;

    if (!dob) {
      throw Error(`invalid 'dob' value for user: ${user.email}`);
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      domicile: 'U.S. Citizen',
      dob: dob,
      primCountry: 'USA',
      primAddress1: user.address,
      primAddress2: user.apartment,
      primCity: user.city,
      primState: user.state,
      primZip: user.zipCode,
      emailAddress: user.email,
      socialSecurityNumber: user.ssn,
      KYCstatus: user.isVerified,
      AMLstatus: user.isVerified,
    };
  }

  updatePartyInput(user: User) {
    const dob = user.dob
      ? TimeUtil.getUSDateString(new Date(user.dob).toISOString(), 'LL-dd-yyyy')
      : null;

    if (!dob) {
      throw Error(`invalid 'dob' value for user: ${user.email}`);
    }
    const ssn = user.ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      domicile: 'U.S. Citizen',
      dob: dob,
      primCountry: 'USA',
      primAddress1: user.address,
      primAddress2: user.apartment,
      primCity: user.city,
      primState: user.state,
      primZip: user.zipCode,
      emailAddress: user.email,
      socialSecurityNumber: ssn,
      KYCstatus: user.isVerified,
      AMLstatus: user.isVerified,
    };
  }

  /**
   *
   * @param {User} user
   */
  async createParty(user: User) {
    const createPartyInput = this.createPartyInput(user);

    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createParty',
      data: createPartyInput,
    });

    return res.partyDetails[1][0].partyId;
  }

  async updateParty(partyId, payload) {
    const updatePartyInput = this.updatePartyInput(payload);
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/updateParty',
      data: {
        partyId,
        ...updatePartyInput,
      },
    });

    return res.partyDetails[1];
  }

  async createCampaign(campaign, issuer, ip) {
    const createCampaignInput = {
      issuerId: issuer.ncIssuerId,
      issueName: campaign.campaignName,
      issueType: 'Debt',
      targetAmount: campaign.campaignMinimumAmount,
      minAmount: 0.01,
      maxAmount: campaign.campaignTargetAmount,
      unitPrice: 1,
      startDate: TimeUtil.formatDate(
        new Date(campaign.campaignStartDate).toISOString(),
        'LL-dd-yyyy',
      ),
      endDate: TimeUtil.formatDate(
        new Date(campaign.campaignExpirationDate).toISOString(),
        'LL-dd-yyyy',
      ),
      offeringText: campaign.summary,
      stampingText: 'Confidential',
      createdIpAddress: ip,
    };

    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createOffering',
      data: createCampaignInput,
    });

    const offeringId = res.offeringDetails[1][0].offeringId;

    await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/updateOffering',
      data: {
        ...createCampaignInput,
        offeringStatus: 'Approved',
        offeringId,
      },
    });

    return offeringId;
  }

  /**
   *
   * @param {User} user
   */
  createAccountInputFromUser(user: User) {
    return {
      accountRegistration: user.getFullName(),
      type: 'individual',
      domesticYN: 'domestic_account',
      streetAddress1: user.address,
      streetAddress2: user.apartment,
      city: user.city,
      state: user.state,
      zip: user.zipCode,
      country: 'USA',
      KYCstatus: 'Pending',
      AMLstatus: 'Pending',
      AccreditedStatus: 'Pending',
      approvalStatus: 'approved',
    };
  }

  /**
   * todo needs implementation
   * @param issuer
   */
  createAccountInputFromIssuer(issuer: Issuer) {}

  /**
   *
   * @param {User | Issuer} input
   */
  async createAccount(input) {
    const createAccountInput = input.userId
      ? this.createAccountInputFromUser(input)
      : this.createAccountInputFromIssuer(input);

    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createAccount',
      data: createAccountInput,
    });

    return res.accountDetails[0].accountId;
  }

  async createLink({
    firstEntityType,
    firstEntityId,
    relatedEntityType,
    relatedEntityId,
    linkType = 'member',
    isPrimary = true,
  }) {
    const createLinkInput = {
      firstEntryType: firstEntityType,
      firstEntry: firstEntityId,
      relatedEntryType: relatedEntityType,
      relatedEntry: relatedEntityId,
      linkType,
      primary_value: isPrimary ? 1 : 0,
    };

    return this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createLink',
      data: createLinkInput,
    });
  }

  /**
   *
   * @param {string} accountId
   * @param {InvestorCard} input
   */
  async addCreditCard({ accountId, cardInput, createdIpAddress }) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/addCreditCard',
      data: {
        accountId,
        createdIpAddress,
        ...cardInput,
        creditCardName: 'Test CC Settled',
      },
    });

    return res;
  }

  async deleteCreditCard(accountId, ipAddress) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/deleteCreditCard',
      data: { accountId, updatedIpAddress: ipAddress },
    });
  }

  async createTrade({
    offeringId,
    accountId,
    transactionType,
    transactionUnits,
    createdIpAddress,
  }) {
    try {
      const tradeResult = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/createTrade',
        data: {
          offeringId,
          accountId,
          transactionType,
          transactionUnits,
          createdIpAddress,
        },
      });

      return tradeResult.purchaseDetails[1][0].tradeId;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async linkExternalBankAccount(user) {
    const linkExternalResult = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/linkExternalAccount',
      data: {
        accountId: user.investor.ncAccountId,
      },
    });

    return linkExternalResult.accountDetails;
  }

  createInvestorExternalAccount({
    accountId,
    investorName,
    nickName,
    routingNumber,
    accountNumber,
    ip,
    accountType,
  }) {
    const input = {
      types: 'Account',
      accountId,
      ExtAccountfullname: investorName,
      Extnickname: server.IS_PRODUCTION ? nickName : 'Test ACH Settled',
      ExtRoutingnumber: routingNumber,
      ExtAccountnumber: accountNumber,
      updatedIpAdress: ip,
      accountType,
    };

    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/createExternalAccount',
      data: input,
    });
  }

  async removeExternalAccount({ accountId }) {
    await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/deleteExternalAccount',
      data: {
        accountId,
        types: 'Account',
      },
    });
  }

  async uploadAccreditationDocument(formData) {
    await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/uploadVerificationDocument',
      data: formData,
    });
  }

  async initiateAccreditation(accountId, method = 'Upload') {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/requestAiVerification',
      data: {
        accountId,
        aiMethod: method,
      },
    });
  }

  async getAccreditationRequest(accountId) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getAiRequest',
      data: {
        accountId,
      },
    });
  }

  async updateAIRequest({ aiRequestId, aiRequestStatus }) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/updateAiRequest',
      data: {
        airequestId: aiRequestId,
        aiRequestStatus,
      },
    });
  }

  async createIssuer(issuer, primaryOwner, ip) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createIssuer',
      data: {
        issuerName: issuer.issuerName,
        firstName: primaryOwner.firstName,
        lastName: primaryOwner.lastName,
        email: primaryOwner.email,
        phoneNumber: primaryOwner.phoneNumber,
        createdIpAddress: ip,
      },
    });

    return res.issuerDetails[1][0].issuerId;
  }

  async createIssuerAccount(issuer, ip) {
    const input = {
      issuerId: issuer.ncIssuerId,
      companyName: issuer.issuerName,
      companyState: issuer.state,
      entityType: 'Corp',
      companyTaxId: issuer.EIN,
      addressline1: issuer.physicalAddress,
      city: issuer.city,
      zip: issuer.zipCode,
      country: 'USA',
      issuingCountry: 'USA',
      createdIpAddress: ip,
    };

    return this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/createIssuerAccount',
      data: input,
    });
  }

  async calculateSuitability(accountId) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/calculateSuitability',
      data: {
        accountId,
      },
    });
  }

  async externalFundMove({
    accountId,
    offeringId,
    tradeId,
    NickName,
    amount,
    description,
    checkNumber,
    ip,
  }) {
    try {
      const res = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/externalFundMove',
        data: {
          accountId,
          offeringId,
          tradeId,
          NickName: server.IS_PRODUCTION ? NickName : 'Test ACH Settled',
          amount,
          description,
          checkNumber,
          createdIpAddress: ip,
        },
      });

      return res.TradeFinancialDetails[0].RefNum;
    } catch (err) {
      throw new Error(err);
    }
  }

  async ccFundMove({ accountId, tradeId, ip }) {
    try {
      const res = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/ccFundMove',
        data: {
          accountId,
          tradeId,
          createdIpAddress: ip,
        },
      });

      return res.transactionDetails[0].ccreferencenumber;
    } catch (error) {
      throw new Error(error);
    }
  }

  async ccFundMovement({ accountId, tradeId, amount, ip }) {
    try {
      const res = await this.client.sendRequest({
        httpVerb: this.client.VERBS.POST,
        url: '/ccFundMovement',
        data: {
          accountId,
          tradeId,
          amount,
          createdIpAddress: ip,
        },
      });

      return res.transactionDetails[0].ccreferencenumber;
    } catch (error) {
      throw new Error(error);
    }
  }

  async performAML({ partyId }) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/performAml',
      data: {
        partyId,
      },
    });
  }

  async getKYC({ partyId }) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getKycAml',
      data: {
        partyId,
      },
    });
  }

  async updateAccount(
    accountId?,
    ip?,
    fullName?,
    AccreditedStatus?,
    KYCstatus?,
    AMLstatus?,
  ) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.PUT,
      url: '/updateAccount',
      data: {
        accountId,
        updatedIpAddress: ip,
        accountRegistration: fullName,
        AccreditedStatus,
        KYCstatus,
        AMLstatus,
      },
    });
  }

  async getEscrowAccount(offeringId) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getEscrowAccount',
      data: {
        offeringId,
      },
    });
  }

  async getTradeStatus(tradeId) {
    const trade = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getTradeStatus',
      data: {
        tradeId,
      },
    });

    return trade.tradeDetails[0];
  }

  getTrade(tradeId, accountId) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getTrade',
      data: {
        tradeId,
        accountId,
      },
    });
  }

  async getCCFundMoveInfo(RefNum, accountId) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getCCFundMoveInfo',
      data: {
        RefNum,
        accountId,
      },
    });

    return res.creditcardDetails[0];
  }

  async getACHFundMoveInfo(RefNum, accountId) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getExternalFundMoveInfo',
      data: {
        RefNum,
        accountId,
      },
    });

    return res.investorExternalAccountDetails;
  }

  async fundReturnRequest({ tradeId, requestedBy, reason, notes, ip }) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/cancelInvestment',
      data: {
        tradeId,
        requestedBy,
        reason,
        notes,
        createdIpAddress: ip,
      },
    });
  }

  async performKYCAML({ partyId }) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/performKycAmlBasic',
      data: {
        partyId,
      },
    });
  }

  async sendSubscriptionDocument({ offeringId, accountId, tradeId }) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/sendSubscriptionDocument',
      data: {
        offeringId,
        accountId,
        tradeId,
      },
    });

    return res;
  }

  async updateCampaign(campaign, issuer, ip) {
    const updateCampaignInput = {
      issuerId: issuer.ncIssuerId,
      issueName: campaign.campaignName,
      issueType: 'Debt',
      targetAmount: campaign.campaignMinimumAmount,
      minAmount: 0.01,
      maxAmount: campaign.campaignTargetAmount,
      unitPrice: 1,
      startDate: TimeUtil.formatDate(
        new Date(campaign.campaignStartDate).toISOString(),
        'LL-dd-yyyy',
      ),
      endDate: TimeUtil.formatDate(
        new Date(campaign.campaignExpirationDate).toISOString(),
        'LL-dd-yyyy',
      ),
      offeringText: campaign.summary,
      stampingText: 'Confidential',
      createdIpAddress: ip,
      offeringId: campaign.ncOfferingId,
    };

    const response = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/updateOffering',
      data: {
        ...updateCampaignInput,
        offeringStatus: 'Approved',
      },
    });

    return response.offeringDetails[1][0].offeringId;
  }

  async linkCreditCard(accountId: string) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/linkCreditCard',
      data: {
        accountId,
      },
    });
    return res.accountDetails;
  }

  async getCreditCard(accountId: string) {
    const res = await this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getCreditCard',
      data: {
        accountId,
      },
    });
    return res.creditcardDetails;
  }

  async getLinkedCreditCard(accountId: string) {
    const res = await this.client.sendLinkedRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/getLinkedCreditCard',
      data: {
        accountId,
      },
    });

    return res;
  }

  async deleteTrade(accountId: string, tradeId: string) {
    return this.client.sendRequest({
      httpVerb: this.client.VERBS.POST,
      url: '/deleteTrade',
      data: {
        accountId,
        tradeId,
      },
    });
  }
}

export default NorthCapitalService;
