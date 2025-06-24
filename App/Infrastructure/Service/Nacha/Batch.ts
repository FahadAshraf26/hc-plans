import { DEFAULTS_BATCH_HEADER } from "@infrastructure/Utils/nachaConstants";
import { format } from 'date-fns';
import { Entry } from "./Entry";
import { BatchHeaderFields, BatchHeaderInput, batchHeaderInputSchema } from "./NachaSchema";


export class Batch {
  protected fields: BatchHeaderFields;
  protected entries: Entry[] = [];

  constructor(input: BatchHeaderInput) {
    const parsed = batchHeaderInputSchema.parse(input);

    this.fields = {
      ...DEFAULTS_BATCH_HEADER,
      ...parsed,
    };
  }

  addEntry(entry: Entry) {
    this.entries.push(entry);
  }

  getEntryCount() {
    return this.entries.length;
  }

  getEntriesAddendaCount() {
    return this.entries.reduce((acc, entry) => (entry.hasAddenda() ? acc + 1 : acc), 0);
  }

  getEntriesHash() {
    return this.entries.reduce((acc, entry) => acc + entry.getDfiIdentifier(), 0);
  }

  getEntriesDebitAmount() {
    return this.entries.reduce((acc, entry) => acc + entry.getDebitAmount(), 0);
  }

  getEntriesCreditAmount() {
    return this.entries.reduce((acc, entry) => acc + entry.getCreditAmount(), 0);
  }

  getHeader(number: number) {
    return [
      5,
      this.fields.transactionTypes,
      this.fields.originCompanyName.padEnd(16, ' '),
      (this.fields.originDiscretionaryData || '').padEnd(20, ' '),
      this.fields.originIdentification.padEnd(10, ' '),
      this.fields.code,
      this.fields.description.toUpperCase().padEnd(10, ' '),
      this.fields.descriptiveDate
        ? format(this.fields.descriptiveDate, 'yyMMdd')
        : ' '.repeat(6),
      format(this.fields.effectiveEntryDate, 'yyMMdd'),
      ' '.repeat(3),
      this.fields.originStatusCode,
      this.fields.originDfi,
      number.toString().padStart(7, '0'),
    ].join('');
  }

  getEntries() {
    return this.entries
      .map((entry, idx) =>
        entry.toOutput(this.fields.code, this.fields.originDfi, idx + 1),
      )
      .flat();
  }

  getTrailer(number: number) {
    const entryAddendaCount = this.getEntryCount() + this.getEntriesAddendaCount();

    const entryHash = this.getEntriesHash();
    const debitAmount = this.entries.reduce(
      (acc, entry) => acc + entry.getDebitAmount(),
      0,
    );
    const creditAmount = this.entries.reduce(
      (acc, entry) => acc + entry.getCreditAmount(),
      0,
    );

    return [
      8,
      this.fields.transactionTypes,
      entryAddendaCount.toString().padStart(6, '0'),
      entryHash.toString().padStart(10, '0'),
      debitAmount.toString().padStart(12, '0'),
      creditAmount.toString().padStart(12, '0'),
      this.fields.originIdentification.padEnd(10, ' '),
      (this.fields.messageAuthenticationCode || '').padEnd(19, ' '),
      ' '.repeat(6),
      this.fields.originDfi,
      number.toString().padStart(7, '0'),
    ].join('');
  }

  toOutput(number: number) {
    return [this.getHeader(number), ...this.getEntries(), this.getTrailer(number)];
  }
}
