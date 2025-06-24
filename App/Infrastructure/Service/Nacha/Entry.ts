import { DEFAULTS_ENTRY, CREDIT_TYPES, DEBIT_TYPES } from "@infrastructure/Utils/nachaConstants";
import { EntryAddenda } from "./EntryAddenda";
import { EntryFields, EntryInput, entryInputSchema } from "./NachaSchema";


export class Entry {
  protected fields: EntryFields;
  protected addenda?: EntryAddenda;

  constructor(input: EntryInput) {
    const parsed = entryInputSchema.parse(input);

    this.fields = {
      ...DEFAULTS_ENTRY,
      ...parsed,
    };
  }

  hasAddenda() {
    return !!this.addenda;
  }

  setAddenda(addenda: EntryAddenda) {
    this.addenda = addenda;
  }

  getDfiIdentifier() {
    return parseInt(this.fields.destinationRoutingNumber.slice(0, 8), 10);
  }

  getCreditAmount() {
    return CREDIT_TYPES.includes(this.fields.transactionCode) ? this.fields.amount : 0;
  }

  getDebitAmount() {
    return DEBIT_TYPES.includes(this.fields.transactionCode) ? this.fields.amount : 0;
  }

  getEntry(batchCode: string, originDfi: string, number: number) {
    return [
      this.fields.recordTypeCode,
      this.fields.transactionCode,
      this.fields.destinationRoutingNumber,
      this.fields.destinationAccountNumber.padEnd(17, ' '),
      this.fields.amount.toString().padStart(10, '0'),
      (this.fields.transactionId || '').padEnd(15, ' '),
      this.fields.destinationName.padEnd(22, ' '),
      (this.fields.discretionaryData || '').padEnd(2, ' '),
      this.addenda ? '1' : '0',
      originDfi,
      number.toString().padStart(7, '0'),
    ].join('');
  }

  getAddenda(number: number) {
    if (!this.addenda) {
      return undefined;
    }

    return this.addenda.toOutput(number.toString().padStart(7, '0'));
  }

  toOutput(batchCode: string, originDfi: string, number: number) {
    const lines = [this.getEntry(batchCode, originDfi, number)];

    const addenda = this.getAddenda(number);

    if (addenda) {
      lines.push(addenda);
    }

    return lines;
  }
}
