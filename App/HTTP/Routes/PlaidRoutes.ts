import express from 'express';
const router = express.Router({ mergeParams: true });
import PlaidController from '@controller/PlaidController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const plaidController = container.get<PlaidController>(PlaidController);

router.get('/', auth, makeExpressCallback(plaidController.getPlaidLinkToken));
router.get('/issuerPlaidLinkToken/:issuerId',makeExpressCallback(plaidController.getIssuerPlaidLinkToken))

router.get(
    "/get_idv/:verificationId",
    auth,
    makeExpressCallback(plaidController.getIdentityVerification)
  );
  router.get(
    '/idv/link_token',
    auth,
    makeExpressCallback(plaidController.getIdentityVerificationLinkToken)
  );
router.get(
  "/idv/list_attempts",
  auth,
  makeExpressCallback(plaidController.getIdentityVerificationAttempts)
)

export default router;
