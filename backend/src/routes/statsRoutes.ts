import { Router } from 'express';
import { getAdminStats, getSellerStats } from '../controllers/statsController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerStats);

export default router;
