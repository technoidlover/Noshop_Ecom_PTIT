import { Request, Response } from 'express';
import { Category } from '../models/Category';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Tên danh mục không được để trống.' });
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      res.status(400).json({ message: 'Danh mục này đã tồn tại.' });
      return;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || ''
    });

    res.status(201).json({ message: 'Tạo danh mục thành công!', category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: 'Không tìm thấy danh mục.' });
      return;
    }

    if (name) {
      category.name = name;
      category.slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;

    await category.save();
    res.json({ message: 'Cập nhật danh mục thành công!', category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ message: 'Không tìm thấy danh mục.' });
      return;
    }
    res.json({ message: 'Xóa danh mục thành công!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
