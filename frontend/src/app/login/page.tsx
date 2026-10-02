'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, ShieldAlert, Store, UserCheck, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'admin' | 'seller' | 'buyer') => {
    setError('');
    setDemoLoading(role);

    try {
      await demoLogin(role);
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'seller') router.push('/seller/dashboard');
      else router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || `Không thể đăng nhập demo role ${role}.`);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f04438] items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Đăng Nhập Tài Khoản
          </h1>
          <p className="text-xs text-gray-500">
            Hệ thống mua sắm & quản trị thương mại điện tử noshop
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-orange-950">
            <LogIn className="w-4 h-4 text-[#ea580c]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Đăng Nhập Nhanh 1-Chạm (Dành Cho Kiểm Thử)
            </span>
          </div>
          <p className="text-[11px] text-orange-800">
            Bấm 1 nút bên dưới để trải nghiệm ngay từng vai trò hệ thống:
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemo('admin')}
              disabled={!!demoLoading}
              className="p-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 shadow-sm disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{demoLoading === 'admin' ? '...' : 'Admin'}</span>
            </button>

            <button
              onClick={() => handleDemo('seller')}
              disabled={!!demoLoading}
              className="p-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 shadow-sm disabled:opacity-50"
            >
              <Store className="w-4 h-4" />
              <span>{demoLoading === 'seller' ? '...' : 'Người bán'}</span>
            </button>

            <button
              onClick={() => handleDemo('buyer')}
              disabled={!!demoLoading}
              className="p-2.5 bg-[#f04438] hover:bg-[#d92d20] text-white rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 shadow-sm disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{demoLoading === 'buyer' ? '...' : 'Khách hàng'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-orange-200/60 text-[11px] text-gray-600 space-y-1">
            <div className="font-semibold text-gray-700">Tài khoản mẫu:</div>
            <div>• Admin: <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">admin@noshop.vn</code> / <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">Admin@123</code></div>
            <div>• Seller: <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">seller@noshop.vn</code> / <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">Seller@123</code></div>
            <div>• User: <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">user@noshop.vn</code> / <code className="bg-white/80 px-1 py-0.5 rounded text-gray-800">User@123</code></div>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@noshop.vn"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập với email'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-[#ea580c] font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
