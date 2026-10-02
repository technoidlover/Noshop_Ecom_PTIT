import { Response } from 'express';
import { Order, IOrderItem } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middlewares/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Giỏ hàng trống, không thể tạo đơn hàng.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng.' });
      return;
    }

    let totalAmount = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        res.status(404).json({ message: `Sản phẩm ${item.name || item.productId} không tồn tại.` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Sản phẩm ${product.name} chỉ còn lại ${product.stock} trong kho.` });
        return;
      }

      // Deduct stock and increment sold
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      const itemPrice = product.price;
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: product.images[0] || '',
        seller: product.seller
      });
    }

    const orderCode = 'ORD-' + Date.now().toString().slice(-8) + '-' + Math.floor(100 + Math.random() * 900);

    const order = await Order.create({
      orderCode,
      buyer: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'BANK_TRANSFER' ? 'PAID' : 'UNPAID',
      orderStatus: 'PENDING',
      totalAmount
    });

    res.status(201).json({ message: 'Đặt hàng thành công!', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('buyer', 'name email phone')
      .populate('items.product', 'name images')
      .populate('items.seller', 'name shop');

    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      return;
    }

    // Permission check: buyer, seller of an item in order, or admin
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSeller = order.items.some(
      (item) => item.seller.toString() === req.user!._id.toString()
    );

    if (!isBuyer && !isAdmin && !isSeller) {
      res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này.' });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email phone')
      .populate('items.product', 'name images')
      .populate('items.seller', 'name shop')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      return;
    }

    // Role check: Admin or Seller
    if (req.user.role !== 'admin') {
      const isSeller = order.items.some(
        (item) => item.seller.toString() === req.user!._id.toString()
      );
      if (!isSeller) {
        res.status(403).json({ message: 'Bạn không có quyền cập nhật đơn hàng này.' });
        return;
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    await order.save();
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      return;
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: 'Cập nhật trạng thái thanh toán thành công!', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
