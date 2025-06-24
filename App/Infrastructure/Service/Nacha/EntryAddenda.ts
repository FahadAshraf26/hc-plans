import { DEFAULTS_ENTRY_ADDENDA } from "@infrastructure/Utils/nachaConstants";
import { EntryAddendaFields, EntryAddendaInput, entryAddendaInputSchema } from "./NachaSchema";


export class EntryAddenda {
  protected fields: EntryAddendaFields;

  constructor(input: EntryAddendaInput) {
    const parsed = entryAddendaInputSchema.parse(input);

    this.fields = {
      ...DEFAULTS_ENTRY_ADDENDA,
      ...parsed,
    };
  }

  toOutput(trace: string) {
    return [
      this.fields.recordTypeCode,
      this.fields.addendaTypeCode,
      (this.fields.info || '').padEnd(80, ' '),
      this.fields.sequenceNumber.padStart(4, '0'),
      trace.padEnd(7, ' '),
    ].join('');
  }
}
