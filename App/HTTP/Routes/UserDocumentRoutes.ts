import express from 'express';
import uploadFile from '../Middleware/UploadFile';
import UserDocumentController from '@controller/UserDocumentController';
import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '@http/Utils/makeExpressCallback';

const router = express.Router({ mergeParams: true });

const userDocumentController = container.get<UserDocumentController>(
  UserDocumentController,
);
router.post(
  '/',
  uploadFile.array('userDocument'),
  makeExpressCallback(userDocumentController.createUserDocument),
);
router.get('/', makeExpressCallback(userDocumentController.getUserDocuments));
router.get(
  '/:userDocumentId',

  makeExpressCallback(userDocumentController.findUserDocument),
);

router.get(
  '/:userDocumentId/signedUrl',
  makeExpressCallback(userDocumentController.getCloudSignedDocumentUrl),
);

router.put(
  '/:userDocumentId',

  uploadFile.single('userDocument'),
  makeExpressCallback(userDocumentController.updateUserDocument),
);
router.delete(
  '/:userDocumentId',

  makeExpressCallback(userDocumentController.removeUserDocument),
);

export default router;
