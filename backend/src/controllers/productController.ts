import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { AuthRequest } from '../middlewares/auth';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query: any = { isActive: true };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'sold') sortOptions = { sold: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name shop')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('seller', 'name email shop phone');

    if (!product) {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { name, description, price, originalPrice, stock, category, images } = req.body;

    if (!name || !price || stock === undefined || !category) {
      res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tên, giá, số lượng kho và danh mục.' });
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await Product.create({
      name,
      slug,
      description: description || name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      category,
      seller: req.user._id,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      isActive: true
    });

    res.status(201).json({ message: 'Tạo sản phẩm thành công!', product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      return;
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa sản phẩm này.' });
      return;
    }

    const { name, description, price, originalPrice, stock, category, images, isActive } = req.body;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;
    if (images) product.images = images;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    res.json({ message: 'Cập nhật sản phẩm thành công!', product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      return;
    }

    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền xóa sản phẩm này.' });
      return;
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Đã xóa sản phẩm thành công!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const query: any = {};
    if (req.user.role === 'seller') {
      query.seller = req.user._id;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
