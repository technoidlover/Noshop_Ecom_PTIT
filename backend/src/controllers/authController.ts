import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken, AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, address, shopName, shopDescription } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'Email đã được đăng ký trong hệ thống.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userRole = role === 'seller' ? 'seller' : 'buyer';
    let shopData = undefined;

    if (userRole === 'seller' || shopName) {
      userRole = 'seller';
      shopData = {
        name: shopName || `${name}'s Shop`,
        description: shopDescription || 'Chào mừng bạn đến với gian hàng của chúng tôi!',
        phone: phone || '',
        address: address || ''
      };
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      phone: phone || '',
      address: address || '',
      shop: shopData,
      isActive: true
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: user.shop,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server khi đăng ký.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: 'Tài khoản đã bị khóa bởi Quản trị viên.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: user.shop,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server khi đăng nhập.' });
  }
};

// Đăng nhập nhanh cho Demo Testing (Admin, Seller, Buyer)
export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    let targetEmails = ['user@noshop.vn', 'buyer@noshop.vn'];

    if (role === 'admin') targetEmails = ['admin@noshop.vn'];
    else if (role === 'seller') targetEmails = ['seller@noshop.vn'];

    const user = await User.findOne({ email: { $in: targetEmails } });
    if (!user) {
      res.status(404).json({ message: `Chưa khởi tạo tài khoản mẫu cho vai trò ${role}.` });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: `Đăng nhập thành công với vai trò demo [${user.role}]!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: user.shop,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi demo login.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa đăng nhập.' });
      return;
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      shop: req.user.shop,
      phone: req.user.phone,
      address: req.user.address,
      createdAt: req.user.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa đăng nhập.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      return;
    }

    const { name, phone, address, shopName, shopDescription, shopAddress, shopPhone, password } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (user.role === 'seller' || shopName) {
      user.shop = {
        name: shopName || user.shop?.name || `${user.name}'s Shop`,
        description: shopDescription ?? user.shop?.description ?? '',
        address: shopAddress ?? user.shop?.address ?? address ?? '',
        phone: shopPhone ?? user.shop?.phone ?? phone ?? '',
        logo: user.shop?.logo ?? ''
      };
    }

    await user.save();

    res.json({
      message: 'Cập nhật thông tin thành công!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: user.shop,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
