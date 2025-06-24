import LogUncaughtAppExceptionDTO from '@application/UncaughtException/LogUncaughtAppExceptionDTO';
import GetUncaughtExceptionsDTO from '@application/UncaughtException/GetUncaughtExceptionsDTO';

export const IUncaughtExceptionServiceId = Symbol.for('IUncaughtExceptionService');

export interface IUncaughtExceptionService {
  logServerException(req, error): Promise<any>;
  logException(info, error): Promise<any>;
  logAppException(logUncaughtAppExceptionDTO: LogUncaughtAppExceptionDTO): Promise<any>;
  getUncaughtExceptions(getUncaughtExceptionsDTO: GetUncaughtExceptionsDTO): Promise<any>;
}
