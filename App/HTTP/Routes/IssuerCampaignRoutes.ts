import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignController from '../Controllers/CampaignController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import CampaignQARoutes from './CampaignQARoutes';
import CampaignNewsRoutes from './CampaignNewsRoutes';
import campaignRiskRoutes from './campaignRiskRoutes';
import campaignNotesRoutes from './campaignNotesRoutes';
import campaignDocumentRoutes from './CampaignDocumentRoutes';
import CampaignInfoRoutes from './CampaignInfoRoutes';
import RoughBudgetRoutes from './campaignRoughBudgetRoutes';
import CampaignPLRoutes from './CampaignPLRoutes';
import CampaignFavoriteRoutes from './CampaignFavoriteRoutes';
import CampaignMediaRoutes from './campaignMediaRoutes';
import CampaignTagRoutes from './CampaignTagRoutes';
import CampaignFundRoutes from './CampaignFundRoutes';
import EnttityCampaignFundRoutes from './EntityCampaignFundRoutes';
import CampaignEscrowBankRoutes from './CampaignEscrowBankRoutes';
import CampaignOwnerStoryRoutes from './CampaignOwnerStoryRoutes';
import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import UploadImage from '@http/Middleware/UploadImage';

const campaignController = container.get<CampaignController>(CampaignController);

router.get('/', auth, makeExpressCallback(campaignController.getAllCampaigns));
router.get('/:campaignId', makeExpressCallback(campaignController.findCampaign));
router.put(
  '/:campaignId',
  adminAuth,
  UploadImage.single('signImage'),
  makeExpressCallback(campaignController.updateCampaign),
);
router.delete(
  '/:campaignId',
  adminAuth,
  makeExpressCallback(campaignController.removeCampaign),
);
router.post(
  '/',
  adminAuth,
  UploadImage.single('signImage'),
  makeExpressCallback(campaignController.createCampaign),
);
router.get(
  '/:campaignId/campaignInfo',
  adminAuth,
  makeExpressCallback(campaignController.findCampaignInfo),
);

// router.post(
//   '/:campaignId/triggerOfferChanges',
//   adminAuth,
//   makeExpressCallback(campaignController.triggerOfferedChanges),
// );

router.post(
  '/:campaignId/process',
  makeExpressCallback(campaignController.determineCampaignStatus),
);

router.use(`/:campaignId/qa`, CampaignQARoutes);
router.use(`/:campaignId/news`, CampaignNewsRoutes);
router.use(`/:campaignId/risks`, campaignRiskRoutes);
router.use(`/:campaignId/notes`, adminAuth, campaignNotesRoutes);
router.use(`/:campaignId/documents`, campaignDocumentRoutes);
router.use(`/:campaignId/info`, CampaignInfoRoutes);
router.use(`/:campaignId/roughBudget`, RoughBudgetRoutes);
router.use(`/:campaignId/pl`, CampaignPLRoutes);
router.use(`/:campaignId/favorites`, CampaignFavoriteRoutes); //get not public
router.use('/:campaignId/media', CampaignMediaRoutes);
router.use('/:campaignId/tags', CampaignTagRoutes);
router.use('/:campaignId/funds', CampaignFundRoutes);
router.use('/:campaignId/banks', adminAuth, CampaignEscrowBankRoutes);
router.use('/:campaignId/stories', CampaignOwnerStoryRoutes);
router.use('/:campaignId/entity', EnttityCampaignFundRoutes);

export default router;
