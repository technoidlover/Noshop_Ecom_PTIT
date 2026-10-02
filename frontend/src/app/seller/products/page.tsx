'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api, { formatPrice } from '@/lib/api';
import { Product } from '@/types';
import { PlusCircle, Trash2, Edit, Package } from 'lucide-react';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/seller/my-products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert('Đã xóa sản phẩm thành công!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Danh sách tất cả sản phẩm thuộc gian hàng của bạn ({products.length})
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Đang tải danh sách sản phẩm...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Sản Phẩm</th>
                  <th className="px-4 py-4">Giá Bán</th>
                  <th className="px-4 py-4">Kho</th>
                  <th className="px-4 py-4">Đã Bán</th>
                  <th className="px-4 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 block truncate max-w-xs">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {typeof product.category === 'object' ? product.category.name : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4">{product.stock}</td>
                    <td className="px-4 py-4 font-semibold text-emerald-600">{product.sold}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {product.stock > 0 ? 'Đang bán' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/seller/products/${product._id}/edit`}
                        className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
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
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">Chưa có sản phẩm nào</h3>
            <p className="text-xs text-gray-500 mt-1">Hãy đăng sản phẩm đầu tiên để bắt đầu bán hàng</p>
            <Link
              href="/seller/products/new"
              className="mt-4 inline-block px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow"
            >
              Đăng sản phẩm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
