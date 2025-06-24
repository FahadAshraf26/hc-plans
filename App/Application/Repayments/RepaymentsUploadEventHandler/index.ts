import { EventEmitter } from '@infrastructure/EventBus/EventEmitter';
import { IUploadRepayments } from './IUploadRepayments';

export const UploadRepaymentsEventHandler = (
  uploadRepayment: IUploadRepayments,
) => {
  const uploadRepaymentsEventHandler = new EventEmitter();

  uploadRepaymentsEventHandler.on('uploadRepayments', async (repaymentsObject: any, email: string) => {
    await uploadRepayment.importRepayments(repaymentsObject, email);
  });

  return uploadRepaymentsEventHandler;
};
