import { injectable } from "inversify";
import { INachaService } from "./INachaService";
import { toCents } from "@infrastructure/Utils/toCents";
import { BatchCode, ServiceClass, TransactionCode } from "@infrastructure/Utils/nachaConstants";
import { Batch } from "./Batch";
import { Nacha } from "./Nacha";
import { Entry } from "./Entry";
import path from 'path';
import fs from 'fs';
import Config from "@infrastructure/Config";
const { nachaConfig } = Config;

@injectable()
class NachaService implements INachaService {

  constructor() { }

  async createNachaFile(data: any, fileName: string): Promise<{filePath: string}> {
    const nacha = new Nacha({
      fileCreationDate: new Date(),
      fileIdModifier: '0',
      originName: nachaConfig.ORIGIN_NAME,
      destinationName: nachaConfig.DESTINATION_NAME,
      originRoutingNumber: nachaConfig.ORIGIN_ROUTING_NUMBER,
      destinationRoutingNumber: nachaConfig.DESTINATION_ROUTING_NUMBER,
      referenceCode: nachaConfig.REFERENCE_CODE,
    });

    const batch = new Batch({
      transactionTypes: ServiceClass.CreditDebit,
      originCompanyName: nachaConfig.ORIGIN_NAME,
      originDiscretionaryData: '',
      originIdentification: nachaConfig.ORIGIN_IDENTIFICATION,
      code: BatchCode.PPD,
      description: 'Refund',
      descriptiveDate: new Date(),
      effectiveEntryDate: new Date(),
      originDfi: nachaConfig.ORIGIN_DFI,
    });

    let sumOfAllRefunds = 0;
    data.map((userdata) => {
      let destinationName = userdata.firstName+' '+userdata.lastName;
      if (destinationName.length > 22) {
        destinationName = destinationName.substring(0, 22);
      }
      const entry = new Entry({
        transactionCode: TransactionCode.CheckingCredit,
        destinationRoutingNumber: userdata.routingNumber,
        destinationAccountNumber: userdata.accountNumber,
        amount: toCents(userdata.amount),
        destinationName,
        discretionaryData: '',
      });

      sumOfAllRefunds += userdata.amount
      batch.addEntry(entry);
    })

    const offsetEntry = new Entry({
      transactionCode: TransactionCode.CheckingDebit,
      destinationRoutingNumber: nachaConfig.ORIGIN_ROUTING_NUMBER,
      destinationAccountNumber: nachaConfig.DESTINATION_ACCOUNT_NUMBER,
      amount: toCents(sumOfAllRefunds),
      destinationName: 'OFFSET',
      discretionaryData: '',
    });

    batch.addEntry(offsetEntry);
    nacha.addBatch(batch);
    const output = nacha.toOutput();

    const filePath = path.join(process.cwd(), 'static', `${fileName}.txt`);
    fs.writeFileSync(filePath, output, 'utf8');

    return {filePath: filePath};
  }
}

export default NachaService;
