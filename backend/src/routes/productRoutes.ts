import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts
} from '../controllers/productController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/seller/my-products', protect, authorize('seller', 'admin'), getSellerProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;
