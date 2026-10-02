'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Tags, ShoppingCart, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-500">Đang tải Trang Quản Trị...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { label: 'Báo cáo tổng quan', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Quản lý người dùng', href: '/admin/users', icon: Users },
    { label: 'Quản lý danh mục', href: '/admin/categories', icon: Tags },
    { label: 'Toàn bộ đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-gray-900 truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider bg-rose-50 px-2 py-0.5 rounded">
                  Hệ Thống Quản Trị
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link
                href="/"
                className="flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-rose-600 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại sàn mua hàng</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
