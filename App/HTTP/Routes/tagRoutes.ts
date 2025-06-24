import express from 'express';
const router = express.Router({ mergeParams: true });

import TagController from '../Controllers/TagController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const tagController = container.get<TagController>(TagController);

router.get('/public', makeExpressCallback(tagController.getAllPublichTag));
router.post('/', adminAuth, makeExpressCallback(tagController.createTag));
router.get('/', adminAuth, makeExpressCallback(tagController.getAllTag));
router.get('/:tagId', adminAuth, makeExpressCallback(tagController.findTag));
router.put('/:tagId', adminAuth, makeExpressCallback(tagController.updateTag));
router.delete('/:tagId', adminAuth, makeExpressCallback(tagController.removeTag));

export default router;
