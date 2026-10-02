'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Category, Product } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`)
        ]);
        setCategories(catRes.data);
        const prod: Product = prodRes.data;
        setFormData({
          name: prod.name,
          category: typeof prod.category === 'object' ? prod.category._id : prod.category,
          price: prod.price.toString(),
          originalPrice: prod.originalPrice ? prod.originalPrice.toString() : '',
          stock: prod.stock.toString(),
          description: prod.description,
          imageUrl: prod.images && prod.images.length > 0 ? prod.images[0] : ''
        });
      } catch (err: any) {
        setError('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await api.put(`/products/${id}`, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : undefined
      });

      alert('Cập nhật sản phẩm thành công!');
      router.push('/seller/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Đang tải sản phẩm...</div>;
  }

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
            Chỉnh Sửa Sản Phẩm
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Cập nhật giá bán, số lượng tồn kho và mô tả</p>
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
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Giá gốc
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Link hình ảnh sản phẩm
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              disabled={saving}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
