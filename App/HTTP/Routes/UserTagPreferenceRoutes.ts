import express from 'express';
const router = express.Router({ mergeParams: true });

import UserTagPreferenceController from '../Controllers/UserTagPreferencesController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';

const userTagPreferenceController = container.get<UserTagPreferenceController>(
  UserTagPreferenceController,
);

router.get(
  '/',
  adminAuth,
  makeExpressCallback(userTagPreferenceController.getUsersWithPreferences),
);

// Save/Replace all tag preferences for a user
router.post(
  '/:userId',
  auth,
  makeExpressCallback(userTagPreferenceController.saveUserTagPreferences),
);

// Get all tag preferences for a user
router.get(
  '/:userId',
  auth,
  makeExpressCallback(userTagPreferenceController.getUserTagPreferences),
);

// Update/Replace all tag preferences for a user
router.put(
  '/:userId',
  auth,
  makeExpressCallback(userTagPreferenceController.updateUserTagPreferences),
);

// Add a single tag preference for a user
router.post(
  '/:userId/tags/:tagId',
  auth,
  makeExpressCallback(userTagPreferenceController.addUserTagPreference),
);

// Remove a single tag preference for a user
router.delete(
  '/:userId/tags/:tagId',
  auth,
  makeExpressCallback(userTagPreferenceController.removeUserTagPreference),
);

// Remove all tag preferences for a user
router.delete(
  '/:userId',
  auth,
  makeExpressCallback(userTagPreferenceController.removeAllUserTagPreferences),
);

export default router;
