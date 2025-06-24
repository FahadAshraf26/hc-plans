import express from 'express';
const router = express.Router({ mergeParams: true });
import container from '../../Infrastructure/DIContainer/container';

import AuthController from '../Controllers/AuthController';
import makeExpressCallback from '../Utils/makeExpressCallback';

const authController = container.get<AuthController>(AuthController);

router.post('/login', makeExpressCallback(authController.adminLogin));

export default router;
