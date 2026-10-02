'use client';

import React, { useEffect, useState } from 'react';
import api, { formatPrice } from '@/lib/api';
import { Order } from '@/types';
import { ShoppingCart, Eye, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/all');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load all orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Toàn Bộ Đơn Hàng Sàn
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Giám sát dòng tiền, đơn hàng và các giao dịch phát sinh trên hệ thống ({orders.length})
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Đang tải danh sách đơn hàng...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-4 py-4">Khách Hàng</th>
                  <th className="px-4 py-4">Ngày Đặt</th>
                  <th className="px-4 py-4">Thanh Toán</th>
                  <th className="px-4 py-4">Trạng Thái Đơn</th>
                  <th className="px-4 py-4">Tổng Tiền</th>
                  <th className="px-6 py-4 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      {order.orderCode}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{order.buyer?.name || 'Khách vãng lai'}</div>
                      <span className="text-[11px] text-gray-400">{order.shippingAddress?.phone}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block font-medium text-gray-800">
                        {order.paymentMethod === 'COD' ? 'COD' : 'VietQR'}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {order.paymentStatus === 'PAID' ? 'Đã TT' : 'Chưa TT'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-red-600">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-gray-400">Chưa có đơn hàng nào trên sàn.</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                Chi Tiết Đơn Hàng #{selectedOrder.orderCode}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-1">
              <p><strong>Người nhận:</strong> {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
              <p><strong>Ghi chú:</strong> {selectedOrder.shippingAddress?.note || 'Không có'}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Danh sách sản phẩm:</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-gray-400">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-gray-100">
              <span>Tổng thanh toán:</span>
              <span className="text-red-600 font-black text-base">{formatPrice(selectedOrder.totalAmount)}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
