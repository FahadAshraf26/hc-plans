import express from 'express';
const router = express.Router({ mergeParams: true });
import AuthController from '../Controllers/AuthController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const authController = container.get<AuthController>(AuthController);

router.post('/auth/Login', makeExpressCallback(authController.login));
router.post('/logout', auth, makeExpressCallback(authController.logout));
router.post('/token/refresh', makeExpressCallback(authController.refreshToken));
router.post('/forgetPassword', makeExpressCallback(authController.forgetPassword));
router.post(
  '/verifyPasswordResetToken',
  makeExpressCallback(authController.verifyResetPasswordToken),
);
router.post('/authFacebook', makeExpressCallback(authController.authFacebook));
router.post('/authGoogle', makeExpressCallback(authController.authGoogle));
router.post('/authApple', makeExpressCallback(authController.authApple));
router.post('/authInstagram', makeExpressCallback(authController.authInstagram));

router.get('/verify/email', makeExpressCallback(authController.verifyEmail));
router.post('/reActivate', makeExpressCallback(authController.reactivateUser));

router.post(
  '/:userId/verify/email',
  auth,
  makeExpressCallback(authController.initiateEmailVerification),
);

router.post(
  '/:userId/verify/biometric',
  makeExpressCallback(authController.initiateBiometricVerification),
);

export default router;
