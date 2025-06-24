import UncaughtException from '../../Domain/Core/UncaughtException/UncaughtException';
import { UncaughtExceptionTypes } from '../../Domain/Core/ValueObjects/UncaughtExceptionTypes';

class LogUncaughtAppExceptionDTO {
  private readonly uncaughtException: any;
  private readonly req: any;

  constructor(req: any) {
    this.uncaughtException = UncaughtException.createFromDetail(
      req.body.message,
      UncaughtExceptionTypes.APP,
      req.body,
    );
    this.req = req;
  }

  getRequest() {
    return this.req;
  }

  getUncaughtException() {
    return this.uncaughtException;
  }

  getErrorMssage() {
    return this.req.body.message;
  }
}

export default LogUncaughtAppExceptionDTO;
