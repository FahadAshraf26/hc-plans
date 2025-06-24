import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

export class ProjectionReturns extends BaseEntity {
  private readonly projectionReturnsId: string;
  private readonly interest: number;
  private readonly principle: number;
  private investorPaymentsId: string;

  constructor(projectionReturnsId: string, interest: number, principle: number) {
    super();
    this.projectionReturnsId = projectionReturnsId;
    this.interest = interest;
    this.principle = principle;
  }

  static createFromObject(projectionReturnsObj) {
    const projectionReturn = new ProjectionReturns(
      projectionReturnsObj.projectionReturnsId,
      projectionReturnsObj.interest,
      projectionReturnsObj.principle,
    );
    if (projectionReturnsObj.createdAt) {
      projectionReturn.setCreatedAt(projectionReturnsObj.createdAt);
    }
    if (projectionReturnsObj.updatedAt) {
      projectionReturn.setUpdatedAt(projectionReturnsObj.updatedAt);
    }
    if (projectionReturnsObj.deletedAt) {
      projectionReturn.setDeletedAT(projectionReturnsObj.deletedAt);
    }

    return projectionReturn;
  }

  static createFromDetail(interest, principle) {
    return new ProjectionReturns(uuid(), interest, principle);
  }

  setInvestorPaymentsId(investorPaymentsId: string) {
    this.investorPaymentsId = investorPaymentsId;
  }

  static createFromCsvInput({ interest, principle, investorPaymentsId, createdAt }) {
    const projectionReturn = new ProjectionReturns(uuid(), interest, principle);
    projectionReturn.setInvestorPaymentsId(investorPaymentsId);
    projectionReturn.setCreatedAt(createdAt);
    return projectionReturn;
  }
}
