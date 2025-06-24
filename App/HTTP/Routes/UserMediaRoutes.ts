import express from 'express';
const router = express.Router({ mergeParams: true });

import UserMediaController from '@controller/UserMediaController';
import container from '@infrastructure/DIContainer/container';
import uploadImage from '../Middleware/UploadImage';
import makeExpressCallback from '../Utils/makeExpressCallback';

const userMediaController = container.get<UserMediaController>(UserMediaController);

router.post(
  '/',
  uploadImage.single('media'),
  makeExpressCallback(userMediaController.createUserMedia),
);
router.get('/', makeExpressCallback(userMediaController.getUserMedia));
router.get('/:userMediaId', makeExpressCallback(userMediaController.findUserMedia));
router.delete('/:userMediaId', makeExpressCallback(userMediaController.deleteUserMedia));

export default router;
