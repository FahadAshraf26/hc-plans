import logger from '@infrastructure/Logger/logger';
import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import { ICreateDwollaPreBankTransactionsUsecase } from './ICreateDwollaPreBankTransactionsUsecase';
import {
  IDwollaPreBankTransactionsRepositoryId,
  IDwollaPreBankTransactionsRepository,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import { inject, injectable } from 'inversify';
import CreateDwollaPreBankTransactionDTO from './CreateDwollaPreBankTransactionsDTO';
import {
  IPreTransactionServiceId,
  IPreTransactionService,
} from '@domain/Services/IPreTransactionService';
import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import uuid from 'uuid/v4';
import CSVHeaders from '@domain/Core/ValueObjects/PreBankTransactionsCSVHeaders';
import DwollaPreBankTransactions from '@domain/Core/DwollaPreBankTransactions/DwollaPreBankTransactions';
import async from 'async';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import HttpError from '@infrastructure/Errors/HttpException';
@injectable()
class CreateDwollaPreBankTransactionsUseCase
  implements ICreateDwollaPreBankTransactionsUsecase {
  constructor(
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionsRepository: IDwollaPreBankTransactionsRepository,
    @inject(IPreTransactionServiceId)
    private dwollaPreBankTransactionService: IPreTransactionService,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private dwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
  ) {}

  async parseCsv(file) {
    return new Promise((resolve, reject) => {
      const dataRows = [];
      const csvStream = fs.createReadStream(
        path.resolve(__dirname, `../../../../Storage`, file.filename),
      );
      csv
        .parseStream(csvStream, { headers: true })

        .on('headers', function (headers) {
          if (JSON.stringify(headers) !== JSON.stringify(CSVHeaders)) {
            resolve({ status: 'error', message: 'Headers does not match' });
          }
        })
        .on('data', async (data) => {
          dataRows.push(data);
        })
        .on('error', function (e) {
          resolve({ status: 'error', message: e });
        })
        .on('end', function () {
          resolve({ status: 'success', dataRows: dataRows });
          const pdfFileStream = path.resolve(
            __dirname,
            `../../../../Storage`,
            file.filename,
          );
          fs.unlink(pdfFileStream, (err) => {
            logger.error(err);
          });
        });
    });
  }

  async importData(dataRows) {
    const uploadId = uuid();

    return async.eachSeries(dataRows, async (data) => {
      let recordStatus = 'success';
      let errorMessage;
      let amount = parseFloat(data['Amount']);

      if (Number.isNaN(amount)) {
        throw new Error('File Data is not valid');
      }

      const issuer = await this.dwollaPreBankTransactionService.validateIssuerName(
        data['Business name'],
      );

      if (issuer === null) {
        errorMessage = `${data['Business name']} is not a valid Business name`;
        recordStatus = 'failed';
      }

      if (data['From'].toLowerCase() === 'bank') {
      } else {
        errorMessage = `From column must be 'Bank' or 'bank'`;
        recordStatus = 'failed';
      }

      if (data['To'].toLowerCase() === 'wallet') {
      } else if (data['To'].toLowerCase() === 'custody') {
      } else {
        throw new HttpError(404, 'To Column should be Wallet or Custody');
      }

      if (issuer !== null) {
        const dwollaBusinessCustomer = await this.dwollaPreBankTransactionService.validateHoneycombDwollaBsuinessCustomer(
          issuer,
        );
        if (dwollaBusinessCustomer === null) {
          errorMessage = `${data['Business name']} does not have dwolla business customer`;
          recordStatus = 'failed';
        }

        if (dwollaBusinessCustomer) {
          const businessCustomerBeneficialOwner = await this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
            dwollaBusinessCustomer.getDwollaCustomerId(),
          );

          if (
            dwollaBusinessCustomer &&
            issuer.getLegalEntityType() !== 'soleProprietorShip'
          ) {
            if (businessCustomerBeneficialOwner === null) {
              errorMessage = `${data['Business name']} does not have dwolla business customer beneficial owner`;
              recordStatus = 'failed';
            }
          }

          if (
            dwollaBusinessCustomer.getDwollaBalanceId() === null ||
            dwollaBusinessCustomer.getDwollaBalanceId() === ''
          ) {
            errorMessage = `${data['Business name']} does not have dwolla wallet Id`;
            recordStatus = 'failed';
          }
        }

        const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
          issuer.issuerId,
        );
        if (issuerBanks) {
          const prefferedAccount = issuerBanks.find(
            (item) => item.isForRepayment === true,
          );

          if (!prefferedAccount) {
            errorMessage = `${data['Business name']} does not have prefered bank account`;
            recordStatus = 'failed';
          }

          if (
            prefferedAccount &&
            (!prefferedAccount.dwollaSourceId ||
              prefferedAccount.dwollaSourceId.trim() === '')
          ) {
            errorMessage = `${data['Business name']} does not have dwolla funding source Id`;
            recordStatus = 'failed';
          }
        }
      }

      const dwollaPreBankTransactionData = {
        uploadId,
        source: data['From'],
        destination: data['To'],
        issuerName: data['Business name'],
        businessOwnerName: data['Business owner name'],
        businessOwnerEmail: data['Business owner email'],
        amount,
        status: recordStatus,
        errorMessage: recordStatus === 'failed' ? errorMessage : '',
      };
      const dwollaPreBankTransactions = DwollaPreBankTransactions.createFromDetail(
        dwollaPreBankTransactionData,
      );
      await this.dwollaPreBankTransactionsRepository.add(dwollaPreBankTransactions);
    });
  }

  async execute(
    createDwollaPreBankTransactionDTO: CreateDwollaPreBankTransactionDTO,
  ): Promise<any> {
    const preBankTransactionsForWallet = await this.dwollaPreBankTransactionsRepository.fetchAllLatestPreBankTransactionsForWallet();
    if (preBankTransactionsForWallet.dwollaPreBankTransactions.length > 0) {
      throw new Error("Can't import data, there is already data in the system");
    }

    const file = createDwollaPreBankTransactionDTO.getFile();
    const response = await this.parseCsv(file);
    if (response['status'] === 'success' && response['dataRows'].length > 0) {
      await this.importData(response['dataRows']);
    }
    if (response['status'] === 'error') {
      return response;
    } else if (response['status'] === 'success' && response['dataRows'].length === 0) {
      return { status: 'success', message: 'No Data found in the file' };
    } else {
      return { status: 'success', message: 'File upload successfully' };
    }
  }
}

export default CreateDwollaPreBankTransactionsUseCase;
