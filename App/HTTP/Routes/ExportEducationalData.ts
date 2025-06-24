import express from 'express';
import adminAuth from '../Middleware/adminAuth';
import UserController from '../Controllers/UserController';
import container from '../../Infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';

const userController = container.get<UserController>(UserController);

const router = express.Router();

router.get(
  '/',
  adminAuth,
  makeExpressCallback(userController.exportEducationMaterialData),
);

export default router;