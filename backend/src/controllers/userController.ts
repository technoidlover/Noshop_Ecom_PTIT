import { Request, Response } from 'express';
import { User } from '../models/User';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'seller', 'buyer'].includes(role)) {
      res.status(400).json({ message: 'Vai trò không hợp lệ.' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      return;
    }

    user.role = role;
    if (role === 'seller' && !user.shop) {
      user.shop = {
        name: `${user.name}'s Shop`,
        description: 'Gian hàng mới khởi tạo',
        phone: user.phone || '',
        address: user.address || ''
      };
    }

    await user.save();
    res.json({ message: 'Cập nhật vai trò thành công!', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `Đã ${user.isActive ? 'kích hoạt' : 'khóa'} tài khoản thành công!`,
      isActive: user.isActive
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
