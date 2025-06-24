import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import SignedUrlController from '@http/Controllers/SignedUrlController';

const signedUrlController = container.get<SignedUrlController>(SignedUrlController);

router.get('/', auth, makeExpressCallback(signedUrlController.getDocumentSignedUrl));

export default router;
