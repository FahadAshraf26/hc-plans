import express from 'express';
import UserAppFeedbackController from '../Controllers/UserFeedbackAppController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const router = express.Router({ mergeParams: true });

const userAppFeedbackController = container.get<UserAppFeedbackController>(
  UserAppFeedbackController,
);

router.post('/', makeExpressCallback(userAppFeedbackController.createUserAppFeedback));
router.get('/', makeExpressCallback(userAppFeedbackController.getUserAppFeedback));
router.get(
  '/:userAppFeedbackId',
  makeExpressCallback(userAppFeedbackController.findUserAppFeedback),
);

export default router;
