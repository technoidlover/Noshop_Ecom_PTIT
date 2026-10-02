'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { formatPrice } from '@/lib/api';
import { DollarSign, ShoppingCart, Package, TrendingUp, Clock, PlusCircle } from 'lucide-react';

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/seller');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load seller stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Đang tải dữ liệu báo cáo...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Tổng Quan Gian Hàng
          </h1>
          <p className="text-xs text-gray-500 mt-1">Hiệu quả kinh doanh và tiến độ đơn hàng</p>
        </div>
        <Link
          href="/seller/products/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng sản phẩm mới</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 font-medium">Doanh thu gian hàng</span>
          <div className="text-xl font-black text-gray-900 mt-1 truncate">
            {formatPrice(stats?.sellerRevenue || 0)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 font-medium">Tổng đơn hàng</span>
          <div className="text-xl font-black text-gray-900 mt-1">
            {stats?.totalOrders || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 font-medium">Sản phẩm đang bán</span>
          <div className="text-xl font-black text-gray-900 mt-1">
            {stats?.totalProducts || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 font-medium">Số lượng đã bán</span>
          <div className="text-xl font-black text-gray-900 mt-1">
            {stats?.itemsSold || 0}
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Đơn Hàng Gần Đây Của Shop
          </h2>
          <Link href="/seller/orders" className="text-xs font-semibold text-[#ea580c] hover:underline">
            Xem tất cả
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-100 text-xs">
            {stats.recentOrders.map((ord: any) => (
              <div key={ord._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{ord.orderCode}</p>
                  <p className="text-gray-400 text-[11px]">
                    Khách: {ord.buyer?.name} • {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">{formatPrice(ord.totalAmount)}</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-400">
            Chưa có đơn hàng nào phát sinh cho gian hàng này.
          </div>
        )}
      </div>
    </div>
  );
}
