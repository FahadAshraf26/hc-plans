import uuid from 'uuid/v4';
import { InvestorAccreditationResult } from '../ValueObjects/InvestorAccreditationResult';
import { InvestorAccreditationStatus } from '../ValueObjects/InvestorAccreditationStatus';
import Investor from '../Investor/Investor';

class InvestorAccreditation {
  private investorAccreditationId: string;
  private investorId: string;
  private accreditationStatus: string;
  private submissionDate: Date;
  result: string;
  private resultDate: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date;
  private investor: Investor;
  accreditedInvestorSubmission: string;

  constructor(
    investorAccreditationId: string,
    investorId: string,
    accreditationStatus: string,
    submissionDate: Date,
  ) {
    this.investorAccreditationId = investorAccreditationId;
    this.investorId = investorId;
    this.accreditationStatus = accreditationStatus
      ? InvestorAccreditationStatus.ACCREDITED
      : InvestorAccreditationStatus.PENDING;
    this.submissionDate = submissionDate;
    this.result = accreditationStatus
      ? InvestorAccreditationResult.ACCREDITED
      : InvestorAccreditationResult.PENDING;
    this.resultDate = new Date();
  }

  setResult(result, resultDate) {
    this.result = result;
    this.resultDate = resultDate;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  setInvestor(investor: Investor) {
    this.investor = investor;
  }

  getInvestorAccreditationId(): string {
    return this.investorAccreditationId;
  }
  /**
   * Create InvestorAccreditation Object
   * @param {object} investorAccreditationObj
   * @returns InvestorAccreditation
   */
  static createFromObject(investorAccreditationObj) {
    const investorAccreditation = new InvestorAccreditation(
      investorAccreditationObj.investorAccreditationId,
      investorAccreditationObj.investorId,
      investorAccreditationObj.accreditationStatus,
      investorAccreditationObj.submission,
    );

    if (investorAccreditationObj.result) {
      investorAccreditation.setResult(
        investorAccreditationObj.result,
        investorAccreditationObj.resultDate,
      );
    }

    if (investorAccreditationObj.investor) {
      investorAccreditation.setInvestor(investorAccreditationObj.investor);
    }

    if (investorAccreditationObj.createdAt) {
      investorAccreditation.setCreatedAt(investorAccreditationObj.createdAt);
    }

    if (investorAccreditationObj.updatedAt) {
      investorAccreditation.setUpdatedAt(investorAccreditationObj.updatedAt);
    }

    if (investorAccreditationObj.deletedAt) {
      investorAccreditation.setDeletedAT(investorAccreditationObj.deletedAt);
    }

    return investorAccreditation;
  }

  /**
   * Create InvestorAccreditation Object with Id
   * @param {string} investorAccreditation
   * @returns InvestorAccreditation
   */
  static createFromDetail(
    investorId: string,
    accreditationStatus: string,
    submissionDate: Date,
  ) {
    return new InvestorAccreditation(
      uuid(),
      investorId,
      accreditationStatus,
      submissionDate,
    );
  }
}

export default InvestorAccreditation;
