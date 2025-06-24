import { DwollaVerificationStatus } from '@domain/Core/ValueObjects/DwollaVerificationStatus';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import dwolla from 'dwolla-v2';
import FormData from 'form-data';
import fs from 'fs';
import { inject, injectable } from 'inversify';
import merge from 'lodash.merge';
import moment from 'moment';
import path from 'path';
import config from '../Config/dwolla';
import DwollaMassPaymentFailedException from '../Errors/DwollaMassPaymentFailedException';
import logger from '../Logger/logger';

const dwollaConfig = config.dwolla;
const dwollaEnvironment =
  dwollaConfig.ENVIRONMENT === 'production' ? 'production' : 'sandbox';
const dwollaClient = new dwolla.Client({
  key: dwollaConfig.APP_KEY,
  secret: dwollaConfig.APP_SECRET,
  environment: dwollaEnvironment,
});

const getCustomerUrl = (customerId) => `${dwollaConfig.BASE_URL}/customers/${customerId}`;

const getCustomerUrlByEmailId = (emailId) =>
  `${dwollaConfig.BASE_URL}/customers?email=${emailId}`;

const getFundingSourceUrl = (fundingSourceId) =>
  `${dwollaConfig.BASE_URL}/funding-sources/${fundingSourceId}`;

const getTransferUrl = (transferId) => `${dwollaConfig.BASE_URL}/transfers/${transferId}`;

const getBeneficialOwnerUrl = (beneficialOwnerID) =>
  `${dwollaConfig.BASE_URL}/beneficial-owners/${beneficialOwnerID}`;

const getEventUrl = (eventId) => `${dwollaConfig.BASE_URL}/events/${eventId}`;

type UpsertCustomer = {
  dwollaCustomerId?: string;
  input?: any;
  idempotencyKey?: string;
};

@injectable()
class DwollaService implements IDwollaService {
  constructor(@inject(IStorageServiceId) private storageService: IStorageService) {}
  /**
   * takes user input and returns object that can be sent to createCustomer to create a customer
   * @param {object} user - user details
   * @param isCustomer
   * @returns object
   */
  createCustomerInput(user, isCustomer = false) {
    const {
      email,
      state,
      zipCode,
      address,
      city,
      firstName,
      lastName,
      phoneNumber,
      dob,
      ssn,
      ip,
    } = user;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !state ||
      !zipCode ||
      !address ||
      !city ||
      !dob ||
      !ssn
    ) {
      return false;
    }

    const date: any = new Date(dob);

    if (isNaN(date)) {
      throw new Error('invalid date format');
    }

    const res = {
      firstName,
      lastName,
      email,
      type: 'personal',
      address1: address,
      city,
      state,
      dateOfBirth: moment(date).format('YYYY-MM-DD'),
      postalCode: zipCode,
      ssn: ssn,
      phone: !!phoneNumber ? phoneNumber : undefined,
      ipAddress: !!ip ? ip : undefined,
    };

    if (
      user.investor &&
      user.investor.dwollaVerificationStatus !==
        DwollaVerificationStatus.RETRY_VERFICATION
    ) {
      isCustomer && delete res.dateOfBirth; // once set, cant be in update request
      isCustomer && delete res.ssn; // once set, cannot be in update request
      isCustomer && delete res.firstName;
      isCustomer && delete res.lastName;
    }

    return res;
  }

  /**
   * takes business input and returns object that can be sent to createCustomer to create a business customer
   * @param {object} issuer
   * @param userDetails
   * @param title
   * @param currentValues
   * @returns {object}
   */
  createBusinessInput(issuer, { userDetails, title }) {
    const {
      issuerName,
      email,
      EIN,
      website,
      physicalAddress,
      legalEntityType,
      city,
      state,
      zipCode,
      dwollaBusinessClassification,
    } = issuer;

    const {
      firstName,
      lastName,
      dob,
      ssn,
      zipCode: userZipCode,
      city: userCity,
      state: userState,
      address: userAddress,
    } = userDetails;

    const date: any = dob ? new Date(dob) : null;

    if (date && isNaN(date)) {
      throw new Error('invalid date format');
    }

    const response = {
      firstName,
      lastName,
      email,
      ssn: ssn,
      type: 'business',
      address1: physicalAddress,
      city,
      state,
      postalCode: zipCode,
      businessName: issuerName,
      businessType: legalEntityType, // [corporation, llc, partnership,soleProprietorship]
      businessClassification: dwollaBusinessClassification, //add
      ein: EIN,
      website,
      controller: {
        firstName,
        lastName,
        email,
        title,
        dateOfBirth: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        ssn: ssn,
        address: {
          address1: userAddress,
          stateProvinceRegion: userState,
          city: userCity,
          postalCode: userZipCode,
          country: 'US',
        },
      },
    };

    if (legalEntityType === 'soleProprietorShip') {
      delete response.controller;
      response['dateOfBirth'] = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
    }

    return response;
  }
  /**
   * @typedef {{firstName:string,lastName:string, dateOfBirth:string,ssn:string,address: {address1:String,stateProvinceRegion:String,city:String,postalCode:String,country:String}}} BeneficialOwnerInput
   * @param {object} user
   * @returns {(BeneficialOwnerInput | false)}
   */
  createBenenficialOwnerInpupt(user) {
    const {
      firstName,
      lastName,
      dob,
      ssn,
      zipCode: userZipCode,
      city: userCity,
      state: userState,
      address: userAddress,
    } = user;

    const date = dob ? new Date(dob) : null;

    if (
      !!!date ||
      !!!firstName ||
      !!!lastName ||
      !!!ssn ||
      !!!userZipCode ||
      !!!userCity ||
      !!!userState ||
      !!!userAddress
    ) {
      return false;
    }

    return {
      firstName,
      lastName,
      dateOfBirth: moment(date).format('YYYY-MM-DD'),
      ssn: ssn,
      address: {
        address1: userAddress,
        stateProvinceRegion: userState,
        city: userCity,
        postalCode: userZipCode,
        country: 'US',
      },
    };
  }

  /**
   *
   * @param {string} customerId
   * @param {BeneficialOwnerInput} beneficialOwnerInput
   */
  async createBeneficialOwner(customerId, beneficialOwnerInput) {
    try {
      const customerUrl = getCustomerUrl(customerId);

      const result = await dwollaClient.post(
        `${customerUrl}/beneficial-owners`,
        beneficialOwnerInput,
      );

      const beneficialOwnerId = result.headers.get('location').split('/').pop();

      return beneficialOwnerId;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async updateBeneficialOwner(dwollaBeneficialOwnerId, beneficialOwnerInput) {
    try {
      const beneficialOwnerUrl = getBeneficialOwnerUrl(dwollaBeneficialOwnerId);
      const result = await dwollaClient.post(
        `${beneficialOwnerUrl}`,
        beneficialOwnerInput,
      );
      const beneficialOwnerId = result.body.id;
      return beneficialOwnerId;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async deleteBeneficialOwner(dwollaBeneficialOwnerId: string){
    try {
      const beneficialOwnerUrl = getBeneficialOwnerUrl(dwollaBeneficialOwnerId);
      await dwollaClient.delete(`${beneficialOwnerUrl}`);
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async getBeneficialOwner(beneficialOwnerID) {
    try {
      if (!beneficialOwnerID) {
        return false;
      }

      const beneficialOwnerUrl = getBeneficialOwnerUrl(beneficialOwnerID);
      const result = await dwollaClient.get(beneficialOwnerUrl);

      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async listBeneficialOwners(customerId) {
    try {
      const customerUrl = getCustomerUrl(customerId);

      const result = await dwollaClient.get(`${customerUrl}/beneficial-owners`);

      return result.body._embedded['beneficial-owners'];
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async createCustomer(input, idempotencyKey = undefined) {
    try {
      const result = await dwollaClient.post(
        'customers',
        input,
        this.getIdempotencyHeader(idempotencyKey),
      );

      const customerId = result.headers.get('location').split('/').pop();

      return customerId;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /***
   * get dwolla customer details
   * @returns {{id:String,firstName:String,lastName:String,email:String,type:String,address1:String,city:String,state:String,postalCode:String,status:String}}
   */
  async getCustomer(customerId) {
    try {
      const customerUrl = getCustomerUrl(customerId);

      const result = await dwollaClient.get(customerUrl);

      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * It will get the dwolla customer by emailId
   * @param emailId
   * @returns {Promise<*>}
   */
  async getCustomerByEmail(emailId) {
    try {
      const customerUrl = getCustomerUrlByEmailId(emailId);

      const result = await dwollaClient.get(customerUrl);

      if (result.body.total > 0) {
        delete result.body._embedded.customers[0]._links;
        return result.body._embedded.customers[0];
      }
      return false;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async createCustomerDocument({ customerId, file, documentType }) {
    try {
      const customerUrl = getCustomerUrl(customerId);

      const localBufferStream = fs.createReadStream(
        path.resolve(__dirname, `../../../Storage`, file.filename),
      );
      const localFileMetadata = fs.statSync(
        path.resolve(__dirname, `../../../Storage`, file.filename),
      );

      const requestBody = new FormData();
      requestBody.append('documentType', documentType);
      requestBody.append('file', localBufferStream, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: localFileMetadata.size,
      });

      const result = await dwollaClient.post(`${customerUrl}/documents`, requestBody);

      fs.unlink(path.resolve(__dirname, `../../../Storage`, file.filename), (err) => {
        if (err) {
          logger.error(
            `Can not delete file with path: ${path.resolve(
              __dirname,
              `../../../Storage`,
              file.filename,
            )} : ${err}`,
          );
        }
      });

      return result.headers.get('location').split('/').pop();
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   *
   * @param {Object} options
   * @param {string} options.dwollaCustomerId - customer id of dwolla customer to update
   * @param {User} options.input - Customer Details
   * @returns {Promise<string>} customerId - dwolla customer Id
   */
  async upsertCustomer({ dwollaCustomerId, input, idempotencyKey }: UpsertCustomer) {
    try {
      if (!dwollaCustomerId) {
        const result = await dwollaClient.post(
          'customers',
          input,
          this.getIdempotencyHeader(idempotencyKey),
        );
        const customerId = result.headers.get('location').split('/').pop();

        return customerId;
      } else {
        const customerUrl = getCustomerUrl(dwollaCustomerId);
        const result = await dwollaClient.post(customerUrl, input);
        const customerId = result.body.id;
        return customerId;
      }
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async upsertInvestor({ user, currentValues, isAdmin = false }) {
    try {
      user.email = user.email
        ? user.email
        : currentValues.email
        ? currentValues.email
        : undefined;

      const dwollaCustomerId = currentValues.investor
        ? currentValues.investor.dwollaCustomerId
        : undefined;
      const isCustomer = dwollaCustomerId ? true : false;

      if (!isCustomer && !isAdmin) {
        return user;
      } // dont create a new customer

      const accountInput = this.createCustomerInput(
        merge(currentValues, user),
        isCustomer,
      );

      if (accountInput) {
        const customerId = await this.upsertCustomer({
          dwollaCustomerId,
          input: accountInput,
        });
        user.investor = user.investor ? user.investor : currentValues.investor;
        user.investor.dwollaCustomerId = customerId;
      }

      return user;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   *
   * @param customerId
   * @param {object} input
   */
  async updateCustomer(customerId, input) {
    try {
      const customerUrl = getCustomerUrl(customerId);
      const result = await dwollaClient.post(customerUrl, input);

      return result.body.id;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * add a bank account to a customer to create charges & transfers
   * @param {string} customerId - url of customer we are adding funding source to
   * @param {{plaidToken?: string,name:string, _links?: object,routingNumber?:string,accountNumber?:string,bankAccountType?:string}} input
   * @param {string} input.plaidToken - plaid token , if provided routingNumber,accountNumber and _links are not required
   * @param {string} input.name - name of funding source
   * @param {string} input.bankAccountType - type of account ['checking','savings','loan','general-ledger']
   */
  async addFundingSource(customerId, input) {
    try {
      const customerUrl = getCustomerUrl(customerId);
      const result = await dwollaClient.post(`${customerUrl}/funding-sources`, input);

      return result.headers.get('location').split('/').pop();
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async retrieveFundingSource(fundingSourceId) {
    try {
      const fundingSourceUrl = getFundingSourceUrl(fundingSourceId);
      const result = await dwollaClient.get(fundingSourceUrl);

      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async retrieveFundingSourceBalance(fundingSourceId) {
    try {
      const fundingSourceUrl = getFundingSourceUrl(fundingSourceId);
      const result = await dwollaClient.get(`${fundingSourceUrl}/balance`);

      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * for all fundingsources of a business filters by id or type
   * @param {string} customerId - customer whose fundingsources we are retrieving
   * @param {string} input - funding source Id | account type ["balance"]
   * @param options
   */
  async getFundingSource(
    customerId,
    input,
    options = { fetchSources: true, sources: null },
  ) {
    const { fetchSources, sources } = options;

    let fundingSources = [];
    try {
      fundingSources = fetchSources ? await this.listFundingSources(customerId) : sources;
    } catch (err) {
      logger.error(this.parseError(err));
      return false;
    }

    const fundingSource = await fundingSources.find(
      (fundingSource) => fundingSource.type.includes(input) || fundingSource.id === input,
    );

    if (!fundingSource) {
      return false;
    }

    return fundingSource;
  }

  async makeMicroDeposits(fundingSourceId) {
    try {
      const fundingSourceUrl = getFundingSourceUrl(fundingSourceId);

      const makeMicro = await dwollaClient.post(`${fundingSourceUrl}/micro-deposits`);

      return makeMicro;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async verifyFundingSource({
    fundingSourceId,
    firstTransactionAmount,
    secondTransactionAmount,
  }) {
    try {
      const fundingSourceUrl = getFundingSourceUrl(fundingSourceId);

      const verifyMicro = await dwollaClient.post(`${fundingSourceUrl}/micro-deposits`, {
        amount1: {
          value: firstTransactionAmount,
          currency: 'USD',
        },
        amount2: {
          value: secondTransactionAmount,
          currency: 'USD',
        },
      });

      if (verifyMicro.status !== 200) {
        throw new Error('funding source verification failed');
      }

      return true;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * conditions for idempotency
   * dwolla will not perform the same action twice if same idempotency key and requestBody are an exact match
   * idempotency keys expire 24 hours
   */
  getIdempotencyHeader(idempotencyKey) {
    if (!!idempotencyKey === false) {
      return {};
    }

    return {
      'Idempotency-Key': idempotencyKey,
    };
  }

  async listCustomerTransfer(customerUrl) {}

  /**
   *
   * @param {Object} options
   * @param {!string} options.sourceId
   * @param {!string} options.destinationId
   * @param {!number} options.amount
   * @param {Object} options.fee
   * @param {!number} options.fee.amount - fee amount
   * @param {!string} options.fee.chargeToId - chargeToID
   * @param {boolean} options.sameDayACH
   * @param {string} options.idempotencyKey
   */
  async createTransfer({
    sourceId,
    destinationId,
    amount,
    fee,
    sameDayACH = false,
    idempotencyKey = undefined,
  }) {
    try {
      if (!amount || isNaN(Number(amount)) || !sourceId || !destinationId) {
        throw new Error('Invalid input');
      }

      const { amount: applicationFee, chargeToId } = fee;
      const sourceUrl = getFundingSourceUrl(sourceId);
      const destinationUrl = getFundingSourceUrl(destinationId);

      const requestBody: any = {
        _links: {
          source: {
            href: sourceUrl,
          },
          destination: {
            href: destinationUrl,
          },
        },
        amount: {
          currency: 'USD',
          value: amount,
        },
      };

      if (sameDayACH) {
        requestBody.clearing = {
          destination: 'next-available',
        };
      }

      if (applicationFee) {
        requestBody.fees = [this.createFee(applicationFee, chargeToId)];
      }

      const createTransferResult = await dwollaClient.post(
        'transfers',
        requestBody,
        this.getIdempotencyHeader(idempotencyKey),
      );

      return createTransferResult.headers.get('location').split('/').pop(); //get id from url
    } catch (err) {
      const parseError = this.parseError(err).message;
      throw Error(parseError);
    }
  }

  parseError(error) {
    logger.error(error);
    return {
      source: 'dwolla',
      status: error.status || 400,
      code: error.code,
      info: error.message,
      message:
        error.body && error.body._embedded
          ? error.body._embedded.errors.map((item) => item.message)
          : error.body
          ? error.body.message
          : error.message,
    };
  }
  createFee(amount, customerId) {
    const customerUrl = getCustomerUrl(customerId);

    return {
      _links: {
        'charge-to': {
          href: customerUrl,
        },
      },
      amount: {
        value: amount,
        currency: 'USD',
      },
    };
  }

  async retrieveTransfer(transferId) {
    try {
      const transferUrl = getTransferUrl(transferId);
      const transfer = await dwollaClient.get(transferUrl);

      return transfer.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   *
   * @param {!string} sourceId
   * @param {Object[]} destinations
   * @param {!string} destinations.destinationId - id of investor's bank to transfer amount to
   * @param {!number} destinations.amount - amount to transfer to an investor
   * @param {Object} [options={}] - additional options
   */
  async createMassPayment(sourceId, destinations, options = {}) {
    try {
      const sourceUrl = getFundingSourceUrl(sourceId);

      const requestBody = {
        _links: {
          source: {
            href: sourceUrl,
          },
        },
        items: destinations.map((destination) => {
          const destinationUrl = getFundingSourceUrl(destination.destinationId);
          return {
            _links: {
              destination: {
                href: destinationUrl,
              },
            },
            amount: {
              currency: 'USD',
              value: destination.amount,
            },
          };
        }),
      };

      const massPaymentResult = await dwollaClient.post('mass-payments', requestBody);

      return massPaymentResult.headers.get('location').split('/').pop();
    } catch (err) {
      throw new DwollaMassPaymentFailedException(this.parseError(err));
    }
  }

  /**
   *
   * @param {string} customerId
   */
  async listFundingSources(customerId) {
    const customerUrl = getCustomerUrl(customerId);

    const result = await dwollaClient.get(`${customerUrl}/funding-sources`);

    return result.body._embedded['funding-sources'];
  }

  async getBusinessClassifications() {
    try {
      const classifications = await dwollaClient.get('business-classifications');
      return classifications.body._embedded['business-classifications']
        .map(({ _embedded }) => {
          return _embedded['industry-classifications'];
        })
        .reduce((result, industryClassificationArray) => {
          return [...result, ...industryClassificationArray];
        }, []);
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async certifyOwner(customerId) {
    try {
      const customerUrl = getCustomerUrl(customerId);
      const result = await dwollaClient.post(`${customerUrl}/beneficial-ownership`, {
        status: 'certified',
      });
      return result;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async createWebhookSubscription(url) {
    try {
      const requestBody = {
        url,
        secret: dwollaConfig.WEBHOOK_SECRET,
      };

      const result = await dwollaClient.post('webhook-subscriptions', requestBody);

      return result.headers.get('location').split('/').pop();
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async getWebhookSubscriptions() {
    try {
      const result = await dwollaClient.get('webhook-subscriptions');
      return result.body._embedded;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async deleteWebhookSubscription(webhookId) {
    try {
      const result = await dwollaClient.delete(
        `https://api-sandbox.dwolla.com/webhook-subscriptions/${webhookId}`,
      );
      return result;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * returns all events that occurred (now-30days) - (now)
   */
  async getEvents(limit = 200, offset = 0) {
    try {
      const result = await dwollaClient.get('events', {
        limit: limit.toString(),
        offset: offset.toString(),
      });

      return {
        total: result.body.total,
        events: result.body._embedded.events,
      };
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async getEventsSinceDate(date) {
    try {
      const limit = 200;
      let offset = 0;

      const hasOldEvents = (events) =>
        events.find((ev) => moment(ev.created).diff(moment(date)) < 0);

      const { total, events } = await this.getEvents(limit, offset);

      let filteredEvents = events.filter(
        (event) => moment(event.created).diff(moment(date)) >= 0,
      );

      if (hasOldEvents(events)) {
        return filteredEvents;
      }

      const fetchMoreEvents = () =>
        filteredEvents.length !== 0 &&
        filteredEvents.length % limit === 0 &&
        offset < total;

      while (fetchMoreEvents()) {
        offset += limit;
        const { events: eventsP } = await this.getEvents(limit, offset);

        const paginatedEvents = eventsP.filter(
          (event) => moment(event.created).diff(moment(date)) >= 0,
        );

        filteredEvents = [...filteredEvents, ...paginatedEvents];

        if (hasOldEvents(eventsP)) {
          break;
        }
      }
      return filteredEvents;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async getEvent(eventId) {
    try {
      const eventUrl = getEventUrl(eventId);
      const result = await dwollaClient.get(eventUrl);
      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async removeFundingSource(fundingSourceId) {
    try {
      const fundingSourceUrl = getFundingSourceUrl(fundingSourceId);
      await dwollaClient.post(fundingSourceUrl, {
        removed: true,
      });
      return true;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async getOnDemandAuthorization() {
    try {
      const result = await dwollaClient.post('on-demand-authorizations');
      return result.body;
    } catch (err) {
      throw this.parseError(err);
    }
  }

  async createBeneficialOwnerDocuments({ beneficialOwnerId, file, documentType }) {
    try {
      const localBufferStream = fs.createReadStream(
        path.resolve(__dirname, `../../../Storage`, file.filename),
      );
      const localFileMetadata = fs.statSync(
        path.resolve(__dirname, `../../../Storage`, file.filename),
      );

      const requestBody = new FormData();
      requestBody.append('documentType', documentType);
      requestBody.append('file', localBufferStream, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: localFileMetadata.size,
      });
      const beneficialOwnerUrl = getBeneficialOwnerUrl(beneficialOwnerId);
      const result = await dwollaClient.post(
        `${beneficialOwnerUrl}/documents`,
        requestBody,
      );

      fs.unlink(path.resolve(__dirname, `../../../Storage`, file.filename), (err) => {
        if (err) {
          logger.error(
            `Can not delete file with path: ${path.resolve(
              __dirname,
              `../../../Storage`,
              file.filename,
            )} : ${err}`,
          );
        }
      });

      return result.headers.get('location').split('/').pop();
    } catch (err) {
      throw this.parseError(err);
    }
  }

  /**
   * Cancels a Dwolla transaction
   * @param {string} transferId - ID of the Dwolla transaction to be canceled
   */
  async cancelTransaction(transferId: string) {
    try {
      const transferUrl = getTransferUrl(transferId);
      const result = await dwollaClient.post(transferUrl, { status: 'cancelled' });
      
      if (result && result.body && result.body.status === 'cancelled') {
        return true;
      } else {
        throw new Error('Failed to cancel the transaction');
      }
    } catch (err) {
      throw this.parseError(err);
    }
  }
}

export default DwollaService;
