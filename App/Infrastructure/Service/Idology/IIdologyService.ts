import axios from 'axios';

export const IIdologyServiceId = Symbol.for('IIdologyService');
type FetchResults = {
  isScanPending?: boolean;
  isDocumentVerified?: boolean;
  isSummaryResultPassed?: boolean;
  qualifiers?: any;
  userData?: any;
};
type ScanVerificationResult = {
  PENDING: string;
  DOCUMENT_VERIFIED: string;
  TEMPLATE_IDENTIFIED: string;
  DOCUMENT_NOT_VERIFEID: string;
  NOT_READABLE: string;
};

type IdScanApproved = {
  APPROVED: string;
  NOT_APPROVED: string;
};

type IdScanSummaryResult = {
  SUCCESS: string;
  FAILURE: string;
};
export interface IIdologyService {
  validateUser(input: any): Promise<{}>;
  patriotActCheck(input: any): Promise<typeof axios>;
  fetchResults(queryId: string): Promise<FetchResults>;
  fetchScanImage(queryId: string, scanType: string);
  scanImageForVerification(
    queryId: string,
    fronImage: any,
    backImage: any,
    scanDocumentType: string,
  );
  ScanVerificationResult: ScanVerificationResult;
  IdScanApproved: IdScanApproved;
  IdScanSummaryResult: IdScanSummaryResult;
}
