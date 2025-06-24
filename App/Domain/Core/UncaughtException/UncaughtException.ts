import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

class UncaughtException extends BaseEntity {
  uncaughtExceptionId: string;
  private message: string;
  private type: string;
  private data: any;

  /**
   *
   * @param {string} uncaughtExceptionId
   * @param {string} message
   * @param {string} type
   * @param {object} data
   */

  constructor(uncaughtExceptionId: string, message: string, type: string, data: any) {
    super();
    this.uncaughtExceptionId = uncaughtExceptionId;
    this.message = message;
    this.type = type;
    this.data = data;
  }

  setData(data) {
    this.data = data;
  }

  /**
   * Create UncaughtException Object
   * @param {object} uncaughtExceptionObj
   * @returns {UncaughtException} UncaughtException
   */
  static createFromObject(uncaughtExceptionObj: UncaughtException): UncaughtException {
    const uncaughtException = new UncaughtException(
      uncaughtExceptionObj.uncaughtExceptionId,
      uncaughtExceptionObj.message,
      uncaughtExceptionObj.type,
      uncaughtExceptionObj.data,
    );

    if (uncaughtExceptionObj.createdAt) {
      uncaughtException.setCreatedAt(uncaughtExceptionObj.createdAt);
    }

    if (uncaughtExceptionObj.updatedAt) {
      uncaughtException.setUpdatedAt(uncaughtExceptionObj.updatedAt);
    }

    if (uncaughtExceptionObj.deletedAt) {
      uncaughtException.setDeletedAT(uncaughtExceptionObj.deletedAt);
    }

    return uncaughtException;
  }

  /**
   *
   * @param {string} message
   * @param {string} type
   * @param {object} data
   * @returns {UncaughtException} uncaughtException
   */
  static createFromDetail(
    message: string,
    type: string,
    data: object,
  ): UncaughtException {
    message = typeof message === 'string' ? message : JSON.stringify(message);
    return new UncaughtException(uuid(), message, type, data);
  }
}

export default UncaughtException;
