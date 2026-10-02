'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Category } from '@/types';
import { PlusCircle, Trash2, Tags } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await api.post('/categories', {
        name,
        description,
        image: imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
      });

      setCategories([res.data.category, ...categories]);
      setName('');
      setDescription('');
      setImageUrl('');
      alert('Tạo danh mục mới thành công!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tạo danh mục.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      alert('Đã xóa danh mục!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa danh mục.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Quản Lý Danh Mục Ngành Hàng
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Thiết lập các ngành hàng để phân loại và sắp xếp sản phẩm trên sàn ({categories.length})
        </p>
      </div>

      {/* Create Category Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <PlusCircle className="w-4 h-4 text-rose-600" />
          Thêm Danh Mục Mới
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Phụ Kiện Điện Tử"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Link hình ảnh đại diện (URL)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngành hàng..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
            >
              {creating ? 'Đang tạo...' : 'Tạo Danh Mục'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Đang tải danh mục...</div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Hình Ảnh</th>
                  <th className="px-4 py-4">Tên Danh Mục</th>
                  <th className="px-4 py-4">Slug</th>
                  <th className="px-4 py-4">Mô Tả</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <Image
                          src={cat.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-4 py-4 text-gray-400 font-mono text-[11px]">{cat.slug}</td>
                    <td className="px-4 py-4 text-gray-500">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-gray-400">Chưa có danh mục nào.</div>
        )}
      </div>
    </div>
  );
}
