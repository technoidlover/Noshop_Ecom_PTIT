import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

export default router;
