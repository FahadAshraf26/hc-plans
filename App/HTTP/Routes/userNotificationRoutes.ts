import express from 'express';
const router = express.Router({ mergeParams: true });

import PushNotificationController from '@controller/PushNotificationController';
import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';

const pushNotificationController = container.get<PushNotificationController>(
  PushNotificationController,
);

router.get('/', makeExpressCallback(pushNotificationController.getUserNotifications));
router.put(
  '/:pushNotificationId',
  makeExpressCallback(pushNotificationController.updateUserNotification),
);

router.post(
  '/markAsVisited',
  makeExpressCallback(pushNotificationController.setUserNotificationAsMarked),
);

router.post(
  '/markQANotificationAsVisited',
  makeExpressCallback(pushNotificationController.setCampaignQANotificationAsVisited),
);

export default router;
