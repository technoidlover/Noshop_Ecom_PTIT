import { Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ orderStatus: { $ne: 'CANCELLED' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'PENDING' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });

    const recentOrders = await Order.find()
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      totalSellers,
      totalBuyers,
      pendingOrders,
      deliveredOrders,
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const sellerId = req.user._id;
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Orders containing seller's items
    const orders = await Order.find({ 'items.seller': sellerId });

    let sellerRevenue = 0;
    let itemsSold = 0;

    orders.forEach(order => {
      if (order.orderStatus !== 'CANCELLED') {
        order.items.forEach(item => {
          if (item.seller.toString() === sellerId.toString()) {
            sellerRevenue += item.price * item.quantity;
            itemsSold += item.quantity;
          }
        });
      }
    });

    const recentOrders = await Order.find({ 'items.seller': sellerId })
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      sellerRevenue,
      totalOrders: orders.length,
      totalProducts,
      itemsSold,
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
