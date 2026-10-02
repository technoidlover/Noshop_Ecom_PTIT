import { Router } from 'express';
import { getAllUsers, updateUserRole, toggleUserStatus } from '../controllers/userController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id/status', protect, authorize('admin'), toggleUserStatus);

export default router;
