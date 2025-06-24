import axios from 'axios';
import { inject, injectable } from 'inversify';
import qs from 'qs';
import config from '../../Config';
import logger from '../../Logger/logger';
import { IIdologyService } from './IIdologyService';
import { ISlackService, ISlackServiceId } from '../Slack/ISlackService';
const { idology } = config.idology;
const { slackConfig } = config;

const idologyClient = axios.create({
  baseURL: 'https://web.idologylive.com',

  headers: {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
});
@injectable()
class IdologyService implements IIdologyService {
  constructor(@inject(ISlackServiceId) private slackService: ISlackService) {}
  ScanVerificationResult = {
    PENDING: 'Pending',
    DOCUMENT_VERIFIED: 'result.document.verified',
    TEMPLATE_IDENTIFIED: 'result.ocr.completed',
    DOCUMENT_NOT_VERIFEID: 'result.document.not.verified',
    NOT_READABLE: 'result.id.scan.not.readable',
  };

  IdScanApproved = {
    APPROVED: 'result.id.scan.approved',
    NOT_APPROVED: 'result.id.scan.not.approved',
  };

  IdScanSummaryResult = {
    SUCCESS: 'expectid.scan.id.success',
    FAILURE: 'expectid.scan.id.failure',
  };

  /**
   * @typedef {{isIdentityMatched: boolean,isResultMatched: boolean,badActorFlagged:boolean,idologyIdNumber:string,idologyScanUrl:string,idologyScanUrlExpirationTime:Date}} IdologyResult
   * @param {User} input
   * @returns {Promise<IdologyResult>} res
   */
  async validateUser(input) {
    const { firstName, lastName, address, zipCode, ssn } = input;
    const lastFourSsn = ssn.slice(-4);
    try {
      const { data } = await idologyClient.post(
        `/api/idiq.svc?username=${idology.USERNAME}&password=${idology.PASSWORD}&firstName=${firstName}&lastName=${lastName}&address=${address}&zip=${zipCode}&ssnLast4=${lastFourSsn}&output=JSON`,
      );
      const identityCheck = data;

      if (identityCheck.response && identityCheck.response.failed) {
        throw new Error(
          `KYC check failed with following errors: ${identityCheck.response.failed}`,
        );
      }
      const idologyIdNumber = identityCheck.response['id-number'];
      const isResultMatched = identityCheck.response.results.key === 'result.match';

      const badActorFlagged =
        identityCheck.response && identityCheck.response.restriction ? true : false;

      const isIdentityMatched =
        identityCheck.response &&
        identityCheck.response['summary-result'] &&
        identityCheck.response['summary-result'].message === 'PASS'
          ? true
          : false;

      const idologyScanUrl =
        identityCheck.response['id-scan'] === 'yes'
          ? identityCheck.response['id-scan-url']
          : undefined;

      let idologyScanUrlExpirationTime = undefined;
      if (idologyScanUrl) {
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(new Date().getDate() + 2);
        idologyScanUrlExpirationTime = twoDaysFromNow;
      }

      return {
        isIdentityMatched,
        badActorFlagged,
        idologyIdNumber,
        isResultMatched,
        idologyScanUrl,
        idologyScanUrlExpirationTime,
      };
    } catch (error) {
      await this.slackService.publishMessage({ message: `Idology: ${error}` });
      throw error;
    }
  }
  async patriotActCheck(input) {
    try {
      const { data } = await idologyClient.post(
        '/api/pa-standalone.svc',
        qs.stringify(input),
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchResults(queryId) {
    try {
      const { data } = await idologyClient.post(
        `/api/idscan.svc`,
        qs.stringify({ queryId }),
      );

      const { response: scanVerifyResults } = await data;

      const isScanPending =
        scanVerifyResults['id-scan-result'] &&
        scanVerifyResults['id-scan-result'].key === this.ScanVerificationResult.PENDING;

      if (isScanPending) {
        return {
          isScanPending,
        };
      }

      const documentVerificationResult = scanVerifyResults['id-scan-verification-result']
        ? scanVerifyResults['id-scan-verification-result'].key
        : null;

      const isDocumentVerified =
        documentVerificationResult === this.ScanVerificationResult.DOCUMENT_VERIFIED ||
        documentVerificationResult.TEMPLATE_IDENTIFIED;

      if (!isDocumentVerified) {
        return {
          isScanPending,
          isDocumentVerified,
        };
      }

      const isSummaryResultPassed =
        scanVerifyResults['id-scan-summary-result'] &&
        scanVerifyResults['id-scan-summary-result'].key ===
          this.IdScanSummaryResult.SUCCESS;

      if (isSummaryResultPassed) {
        return {
          isScanPending,
          isDocumentVerified,
          isSummaryResultPassed,
        };
      }
      // get qualifiers , matched data if any, user provided image
      const qualifiers = scanVerifyResults.qualifiers
        ? Array.isArray(scanVerifyResults.qualifiers.qualifier)
          ? scanVerifyResults.qualifiers.qualifier.map((item) => item.message)
          : [scanVerifyResults.qualifiers.qualifier.message]
        : [];
      const userData = scanVerifyResults['located-id-scan-record'];

      return {
        isScanPending,
        isDocumentVerified,
        isSummaryResultPassed,
        qualifiers,
        userData,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   *
   * @param {string} queryId
   * @param {("first"|"firstBack")} scanType
   */
  async fetchScanImage(queryId, scanType) {
    try {
      const { data } = await idologyClient.post(
        `/api/idscanimage.svc`,
        qs.stringify({ queryId, scanType }),
      );

      const response = await data;

      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async scanImageForVerification(queryId, frontImage, backImage, scanDocumentType) {
    try {
      await idologyClient.post(
        `/api/idscanperform.svc?username=${idology.USERNAME}&password=${idology.PASSWORD}&queryId=${queryId}&image=${frontImage}&backImage=${backImage}&countryCode=USA&scanDocumentType=${scanDocumentType}&output=json`,
      );
    } catch (error) {
      throw error;
    }
  }
}

export default IdologyService;
