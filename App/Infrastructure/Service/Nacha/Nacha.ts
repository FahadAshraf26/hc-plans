import { DEFAULTS_NACHA, blankLine } from "@infrastructure/Utils/nachaConstants";
import { format } from 'date-fns';
import { Batch } from "./Batch";
import { NachaFields, NachaInput, nachaInputSchema } from "./NachaSchema";


export class Nacha {
  protected fields: NachaFields;
  protected batches: Batch[] = [];

  constructor(input: NachaInput) {
    const parsed = nachaInputSchema.parse(input);

    this.fields = {
      ...DEFAULTS_NACHA,
      ...parsed,
    };
  }

  addBatch(batch: Batch) {
    this.batches.push(batch);
  }

  getHeader() {
    return [
      this.fields.recordTypeCode,
      this.fields.priorityCode,
      this.fields.destinationRoutingNumber.padStart(10, ' '),
      this.fields.originRoutingNumber.padStart(10, ' '),
      format(this.fields.fileCreationDate, 'yyMMdd'),
      format(this.fields.fileCreationDate, 'HHmm'),
      this.fields.fileIdModifier,
      this.fields.recordSize,
      this.fields.blockingFactor,
      this.fields.formatCode,
      (this.fields.destinationName || '').padEnd(23, ' '),
      (this.fields.originName || '').padEnd(23, ' '),
      (this.fields.referenceCode || '').padEnd(8, ' '),
    ].join('');
  }

  getTrailer(totalLines: number) {
    const blockCount = Math.ceil(totalLines / 10);

    const entryAddendaCount = this.batches.reduce(
      (acc, batch) => acc + batch.getEntryCount() + batch.getEntriesAddendaCount(),
      0,
    );
    const entriesHash = this.batches.reduce(
      (acc, batch) => acc + batch.getEntriesHash(),
      0,
    );
    const debitAmount = this.batches.reduce(
      (acc, batch) => acc + batch.getEntriesDebitAmount(),
      0,
    );
    const creditAmount = this.batches.reduce(
      (acc, batch) => acc + batch.getEntriesCreditAmount(),
      0,
    );

    return [
      9,
      this.batches.length.toString().padStart(6, '0'),
      blockCount.toString().padStart(6, '0'),
      entryAddendaCount.toString().padStart(8, '0'),
      entriesHash.toString().padStart(10, '0'),
      debitAmount.toString().padStart(12, '0'),
      creditAmount.toString().padStart(12, '0'),
      ' '.repeat(39),
    ].join('');
  }

  toOutput() {
    const lines = [
      this.getHeader(),

      ...this.batches.map((batch, idx) => batch.toOutput(idx + 1)).flat(),
    ];

    lines.push(this.getTrailer(lines.length + 1));

    const leftOverLines = lines.length % 10;

    return [
      ...lines,
      ...Array(leftOverLines > 0 ? 10 - leftOverLines : 0).fill(blankLine),
    ].join('\n');
  }
}
