import express from 'express';
const router = express.Router({ mergeParams: true });

import TagCategoryController from '../Controllers/TagCategoryController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const tagCategoryController = container.get<TagCategoryController>(TagCategoryController);

router.get(
  '/public',
  makeExpressCallback(tagCategoryController.getAllPublichTagCategories),
);
router.post('/', adminAuth, makeExpressCallback(tagCategoryController.createTagCategory));
router.get('/', adminAuth, makeExpressCallback(tagCategoryController.getAllTagCategory));
router.get(
  '/:tagCategoryId',
  adminAuth,
  makeExpressCallback(tagCategoryController.findTagCategory),
);
router.put(
  '/:tagCategoryId',
  adminAuth,
  makeExpressCallback(tagCategoryController.updateTagCategory),
);
router.delete(
  '/:tagCategoryId',
  adminAuth,
  makeExpressCallback(tagCategoryController.removeTagCategory),
);

export default router;
