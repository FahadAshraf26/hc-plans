import uuid from 'uuid/v4';
import { KycStatus } from '../ValueObjects/KycStatus';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class IdologyTimestamp extends BaseEntity {
  private idologyTimestampId: string;
  private userId: string;
  private date: Date;
  private isVerified: string;
  private idologyIdNumber: string;
  private isResultMatched: boolean;
  private badActorFlagged: boolean;
  private idologyScanUrl: string;
  private idologyScanUrlExpirationTime: Date;
  private ncResponse: any;

  constructor(
    idologyTimestampId,
    userId,
    date,
    isVerified,
    idologyIdNumber,
    idologyScanUrl,
    idologyScanUrlExpirationTime,
    isResultMatched,
    badActorFlagged,
  ) {
    super();
    this.idologyTimestampId = idologyTimestampId;
    this.date = date;
    this.userId = userId;
    this.isVerified = isVerified;
    this.idologyIdNumber = idologyIdNumber;
    this.idologyScanUrl = idologyScanUrl;
    this.idologyScanUrlExpirationTime = idologyScanUrlExpirationTime;
    this.isResultMatched = isResultMatched;
    this.badActorFlagged = badActorFlagged;
  }

  setKycResult(
    isVerified?,
    idologyIdNumber?,
    isResultMatched?,
    badActorFlagged = false,
    idologyScanUrl?,
    idologyScanUrlExpirationTime?,
    ncResponse?,
  ) {
    this.isVerified = isVerified;
    this.idologyIdNumber = idologyIdNumber;
    this.isResultMatched = isResultMatched;
    this.badActorFlagged = badActorFlagged;
    this.idologyScanUrl = idologyScanUrl;
    this.idologyScanUrlExpirationTime = idologyScanUrlExpirationTime;
    this.ncResponse = ncResponse;
  }

  setIsVerified(isVerified) {
    this.isVerified = isVerified;
  }

  getUserId(): string {
    return this.userId;
  }

  /**
   * Create IdologyTimestamp Object
   * @param {object} idologyTimestampObj
   * @returns IdologyTimestamp
   */
  static createFromObject(idologyTimestampObj) {
    const idologyTimestamp = new IdologyTimestamp(
      idologyTimestampObj.idologyTimestampId,
      idologyTimestampObj.userId,
      idologyTimestampObj.date,
      idologyTimestampObj.isVerified,
      idologyTimestampObj.idologyIdNumber,
      idologyTimestampObj.isResultMatched,
      idologyTimestampObj.badActorFlagged,
      idologyTimestampObj.idologyScanUrl,
      idologyTimestampObj.idologyScanUrlExpirationTime,
    );

    if (idologyTimestampObj.idologyIdNumber) {
      idologyTimestamp.setKycResult(
        idologyTimestampObj.isVerified,
        idologyTimestampObj.idologyIdNumber,
        idologyTimestampObj.isResultMatched,
        idologyTimestampObj.badActorFlagged,
        idologyTimestampObj.idologyScanUrl,
        idologyTimestampObj.idologyScanUrlExpirationTime,
        idologyTimestampObj.ncResponse,
      );
    }

    if (idologyTimestampObj.createdAt) {
      idologyTimestamp.setCreatedAt(idologyTimestampObj.createdAt);
    }

    if (idologyTimestampObj.updatedAt) {
      idologyTimestamp.setUpdatedAt(idologyTimestampObj.updatedAt);
    }

    if (idologyTimestampObj.deletedAt) {
      idologyTimestamp.setDeletedAT(idologyTimestampObj.deletedAt);
    }

    return idologyTimestamp;
  }

  /**
   * Create IdologyTimestamp Object with Id
   * @returns IdologyTimestamp
   * @param userId
   * @param date
   * @param isVerified
   * @param ncResponse
   */
  static createFromDetail(
    userId: string,
    date: Date,
    isVerified: string = KycStatus.FAIL,
    idologyIdNumber,
    idologyScanUrl,
    idologyScanUrlExpirationTime,
    isResultMatched,
    badActorFlagged,
  ) {
    return new IdologyTimestamp(
      uuid(),
      userId,
      date,
      isVerified,
      idologyIdNumber,
      idologyScanUrl,
      idologyScanUrlExpirationTime,
      isResultMatched,
      badActorFlagged,
    );
  }
}

export default IdologyTimestamp;
