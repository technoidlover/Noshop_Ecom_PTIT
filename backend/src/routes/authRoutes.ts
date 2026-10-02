import { Router } from 'express';
import { register, login, demoLogin, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
