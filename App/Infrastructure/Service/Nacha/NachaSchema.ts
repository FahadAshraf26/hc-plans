import { BatchCode, DEFAULTS_BATCH_HEADER, DEFAULTS_ENTRY, DEFAULTS_ENTRY_ADDENDA, DEFAULTS_NACHA, ServiceClass, TransactionCode } from '@infrastructure/Utils/nachaConstants';
import { z } from 'zod';


export const batchHeaderInputSchema = z.object({
  transactionTypes: z.nativeEnum(ServiceClass),
  originCompanyName: z.string().max(16),
  originDiscretionaryData: z.string().max(20).optional(),
  originIdentification: z.string().max(10),
  code: z.nativeEnum(BatchCode),
  description: z.string().max(10),
  descriptiveDate: z.date().optional(),
  effectiveEntryDate: z.date().optional().default(new Date()),
  originDfi: z.string().length(8),
  messageAuthenticationCode: z.string().length(19).optional(),
});

export const entryInputSchema = z.object({
  transactionCode: z.nativeEnum(TransactionCode),
  destinationRoutingNumber: z.string().length(9),
  destinationAccountNumber: z.string().max(17),
  amount: z.number().int(),
  transactionId: z.string().regex(/^\d+$/).max(15).optional(),
  destinationName: z.string().max(22),
  discretionaryData: z.string().max(2).optional().default(''),
  addendaId: z.string().length(1).optional(),
});

export const nachaInputSchema = z.object({
  originRoutingNumber: z.string().length(9),
  originName: z.string().max(23).optional(),
  destinationRoutingNumber: z.string().length(9),
  destinationName: z.string().max(23).optional(),
  fileCreationDate: z.date().optional().default(new Date()),
  fileIdModifier: z
    .string()
    .regex(/^[A-Z0-9]{1}$/, 'Value must be single character A-Z or 0-9')
    .optional()
    .default('A'),
  referenceCode: z.string().max(8).optional(),
});

export const entryAddendaInputSchema = z.object({
  info: z.string().max(80).optional(),
});

export type BatchHeaderInput = z.input<typeof batchHeaderInputSchema>;

export type BatchHeaderFields = z.infer<typeof batchHeaderInputSchema> & typeof DEFAULTS_BATCH_HEADER;

export type EntryInput = z.input<typeof entryInputSchema>;

export type EntryFields = z.infer<typeof entryInputSchema> & typeof DEFAULTS_ENTRY;

export type EntryAddendaInput = z.input<typeof entryAddendaInputSchema>;

export type EntryAddendaFields = z.infer<typeof entryAddendaInputSchema> & typeof DEFAULTS_ENTRY_ADDENDA;

export type NachaInput = z.input<typeof nachaInputSchema>;

export type NachaFields = z.infer<typeof nachaInputSchema> & typeof DEFAULTS_NACHA;
