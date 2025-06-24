import * as express from 'express';
import container from '@infrastructure/DIContainer/container';
import UserEventsController from '@controller/UserEventsController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
const router = express.Router({ mergeParams: true });

const userEventsController = container.get<UserEventsController>(UserEventsController);

router.get('/', adminAuth, makeExpressCallback(userEventsController.get));

export default router;
