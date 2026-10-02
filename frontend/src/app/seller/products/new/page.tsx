'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Category } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setLoading(true);

    try {
      await api.post('/products', {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        description: formData.description || formData.name,
        images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80']
      });

      alert('Đăng sản phẩm thành công!');
      router.push('/seller/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center space-x-3">
        <Link
          href="/seller/products"
          className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Thêm Sản Phẩm Mới
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Điền thông tin chi tiết để đăng bán sản phẩm</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: iPhone 16 Pro Max 256GB"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ngành hàng / Danh mục *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Ví dụ: 50"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ví dụ: 34990000"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Giá niêm yết gốc (nếu có giảm giá)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="Ví dụ: 37990000"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Link hình ảnh sản phẩm (URL)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Để trống sẽ sử dụng ảnh mặc định của hệ thống
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả thông số kỹ thuật, bảo hành, tình trạng máy..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Link
              href="/seller/products"
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'Lưu & Đăng Bán'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
