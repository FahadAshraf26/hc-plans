import express from 'express';

const router = express.Router({mergeParams: true});

import makeExpressCallback from '@http/Utils/makeExpressCallback';
import GlobalHoneycombConfigurationController from '@controller/GlobalHoneycombConfigurationController';
import container from '@infrastructure/DIContainer/container';
import auth from "@http/Middleware/auth";

const globalHoneycombConfigurationController = container.get<GlobalHoneycombConfigurationController>(GlobalHoneycombConfigurationController);

router.post("/", auth, makeExpressCallback(globalHoneycombConfigurationController.addGlobalHoneycombFee));
router.get('/latestConfiguration', auth, makeExpressCallback(globalHoneycombConfigurationController.fetchGlobalHoneycombConfiguration))

export default router;
