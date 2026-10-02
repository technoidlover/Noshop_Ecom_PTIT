'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import api, { formatPrice } from '@/lib/api';
import { Order } from '@/types';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/seller-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus as any } : ord))
      );
      alert('Đã cập nhật trạng thái đơn hàng!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Quản Lý Đơn Hàng Shop
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi và cập nhật trạng thái đơn hàng phát sinh từ gian hàng ({orders.length})
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Đang tải danh sách đơn hàng...</div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order._id} className="p-6 space-y-4 hover:bg-gray-50/50 transition">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-sm font-bold text-gray-900">
                      Đơn hàng #{order.orderCode}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Đặt lúc: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Trạng thái:</span>
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="PROCESSING">Đang chuẩn bị</option>
                      <option value="SHIPPED">Đang giao hàng</option>
                      <option value="DELIVERED">Đã giao thành công</option>
                      <option value="CANCELLED">Hủy đơn</option>
                    </select>
                  </div>
                </div>

                {/* Customer & Address */}
                <div className="bg-gray-50/70 rounded-2xl p-4 text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Khách hàng:</strong> {order.shippingAddress.fullName}</p>
                    <p><strong>SĐT:</strong> {order.shippingAddress.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  </div>
                  <div>
                    <p><strong>Phương thức TT:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận (COD)' : 'Chuyển khoản VietQR'}</p>
                    <p><strong>Trạng thái TT:</strong> <span className={order.paymentStatus === 'PAID' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></p>
                    {order.shippingAddress.note && (
                      <p><strong>Ghi chú:</strong> {order.shippingAddress.note}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-400">Số lượng: x{item.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="text-right pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 mr-2">Tổng tiền đơn:</span>
                  <span className="text-base font-black text-red-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-gray-500 mt-1">Các đơn hàng phát sinh từ shop sẽ được hiển thị ở đây</p>
          </div>
        )}
      </div>
    </div>
  );
}
