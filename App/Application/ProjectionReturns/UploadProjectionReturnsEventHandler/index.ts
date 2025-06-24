import { EventEmitter } from '@infrastructure/EventBus/EventEmitter';
import { IUploadProjectionReturns } from './IUploadProjectionReturns';

export const UploadProjectionReturnsEventHandler = (
  projectionReturns: IUploadProjectionReturns,
) => {
  const uploadProjectionReturnsEventHandler = new EventEmitter();

  uploadProjectionReturnsEventHandler.on('projectionReturns', async (projectionReturnsObject: any, email: string) => {
    await projectionReturns.importProjectionReturns(projectionReturnsObject, email);
  });

  return uploadProjectionReturnsEventHandler;
};
