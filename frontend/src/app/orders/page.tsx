'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api, { formatPrice } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Đang chuẩn bị hàng
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Giao hàng thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy đơn
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập để xem đơn hàng</h2>
        <Link href="/login" className="text-[#f04438] font-semibold hover:underline text-sm">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-black text-gray-900">Lịch Sử Mua Hàng</h1>
        <p className="text-xs text-gray-500 mt-1">Theo dõi tiến độ và thông tin các đơn hàng đã đặt</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Đang tải danh sách đơn hàng...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-gray-100">
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#f04438]" />
                    <span>Mã Đơn: {order.orderCode}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-gray-400">Số lượng: x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                      <div className="text-[10px] text-gray-400">{formatPrice(item.price)} / sp</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>
                    <strong>Giao đến:</strong> {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                  </p>
                  <p className="text-gray-500 truncate max-w-md">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Hình thức: {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VietQR'} • {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </p>
                </div>

                <div className="text-right w-full sm:w-auto">
                  <span className="text-xs text-gray-500 block">Tổng thanh toán:</span>
                  <span className="text-lg font-black text-red-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs text-gray-500 mt-1">Các sản phẩm bạn đặt mua sẽ hiển thị chi tiết tại đây</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-5 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] text-white text-xs font-bold rounded-xl shadow"
          >
            Mua sắm ngay
          </Link>
        </div>
      )}
    </div>
  );
}
