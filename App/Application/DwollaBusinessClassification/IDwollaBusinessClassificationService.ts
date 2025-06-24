import GetDwollaBusinessClassificationWithIssuerDTO from './GetDwollaBusinessClassificationWithIssuerDTO';

export const IDwollaBusinessClassificationServiceId = Symbol.for(
  'IDwollaBusinessClassificationService',
);

export interface IDwollaBusinessClassificationService {
  getDwollaBusinessClassification(
    getDwollaBusinessClassificationWithIssuerDTO: GetDwollaBusinessClassificationWithIssuerDTO,
  ): Promise<any>;
}
