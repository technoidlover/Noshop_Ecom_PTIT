import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, authorize('seller', 'admin'), getSellerOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);
router.put('/:id/payment', protect, authorize('seller', 'admin'), updatePaymentStatus);

export default router;
