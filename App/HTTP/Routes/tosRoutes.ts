import express from 'express';
const router = express.Router({ mergeParams: true });

import ToSController from '../Controllers/ToSController';
import container from '@infrastructure/DIContainer/container';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const tosController = container.get<ToSController>(ToSController);

router.post('/', auth, makeExpressCallback(tosController.createToS));
router.get('/', auth, makeExpressCallback(tosController.getAllToS));
router.get('/:tosId', auth, makeExpressCallback(tosController.findToS));
router.put('/:tosId', auth, makeExpressCallback(tosController.updateToS));
router.delete('/:tosId', auth, makeExpressCallback(tosController.removeToS));

export default router;
