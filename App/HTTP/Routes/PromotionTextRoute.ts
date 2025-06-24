import express from 'express';

const router = express.Router({ mergeParams: true });

import makeExpressCallback from '@http/Utils/makeExpressCallback';
import PromotionTextController from '@controller/PromotionTextController';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';

const promotionTextController = container.get<PromotionTextController>(
  PromotionTextController,
);

router.post(
  '/',
  adminAuth,
  makeExpressCallback(promotionTextController.addPromotionText),
);
router.get(
  '/latest',
  makeExpressCallback(promotionTextController.fetchPromotionText),
);

export default router; 
