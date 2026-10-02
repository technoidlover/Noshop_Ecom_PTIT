'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, UserPlus, Store, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'buyer',
    shopName: '',
    shopDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      if (formData.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký tài khoản không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f04438] items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-xs text-gray-500">
            Đăng ký để mua sắm hoặc mở gian hàng bán sản phẩm trên noshop
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Bạn muốn tham gia với vai trò:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center space-x-2 text-xs font-bold transition ${
                    formData.role === 'buyer'
                      ? 'border-[#f04438] bg-orange-50/50 text-[#f04438]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Người mua hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center space-x-2 text-xs font-bold transition ${
                    formData.role === 'seller'
                      ? 'border-[#ea580c] bg-orange-50/50 text-[#ea580c]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Người bán hàng</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@noshop.vn"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Hà Nội, Việt Nam"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Seller Shop Details */}
            {formData.role === 'seller' && (
              <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-200 space-y-3">
                <span className="text-xs font-bold text-orange-950 block flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#ea580c]" />
                  Thông Tin Gian Hàng (Shop)
                </span>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tên gian hàng / Thương hiệu *
                  </label>
                  <input
                    type="text"
                    required={formData.role === 'seller'}
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    placeholder="noshop Store Official"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mô tả gian hàng
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shopDescription}
                    onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
                    placeholder="Chuyên phân phối các sản phẩm chính hãng..."
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-[#ea580c] font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
