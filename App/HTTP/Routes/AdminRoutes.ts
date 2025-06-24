import express from 'express';
const router = express.Router({ mergeParams: true });
import AdminUserRoutes from './AdminUserRoutes';
import AdminAuthRoutes from './AdminAuthRoutes';
import AdminRoleRoutes from './AdminRoleRoutes';
import AdminDwollaRoutes from './AdminDwollaRoutes';
import AdminUpdateAchRefundStatus from './AdminUpdateAchRefundStatus';
import adminAuth from '../Middleware/adminAuth';

router.use('/roles', adminAuth, AdminRoleRoutes);
router.use(AdminAuthRoutes);
router.use(adminAuth, AdminUserRoutes);
router.use('/dwolla', AdminDwollaRoutes);
router.use('/updateAchRefundStatus', AdminUpdateAchRefundStatus);

export default router;
