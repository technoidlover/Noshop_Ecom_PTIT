'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api, { formatPrice } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Truck, QrCode, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Copy } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Hà Nội',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <Link href="/products" className="text-[#f04438] font-semibold hover:underline text-xs">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Vui lòng đăng nhập để hoàn tất đặt hàng!', 'info');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const res = await api.post('/orders', {
        items,
        shippingAddress: formData,
        paymentMethod
      });

      clearCart();
      setOrderSuccess(res.data.order);
      showToast('Đặt hàng thành công!', 'success');
    } catch (err: any) {
      console.error('Order error:', err);
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}!`, 'success');
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">Đặt Hàng Thành Công!</h1>
            <p className="text-xs text-gray-500 mt-1">
              Mã đơn hàng: <strong className="text-red-600 font-mono text-sm">{orderSuccess.orderCode}</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left space-y-2 border border-slate-100">
            <p><strong>Người nhận:</strong> {orderSuccess.shippingAddress.fullName} ({orderSuccess.shippingAddress.phone})</p>
            <p><strong>Địa chỉ:</strong> {orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</p>
            <p><strong>Hình thức thanh toán:</strong> {orderSuccess.paymentMethod === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}</p>
            <p><strong>Tổng thanh toán:</strong> <span className="text-red-600 font-bold text-base">{formatPrice(orderSuccess.totalAmount)}</span></p>
          </div>

          {orderSuccess.paymentMethod === 'BANK_TRANSFER' && (
            <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 text-center space-y-3">
              <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                Quét Mã VietQR Chuyển Khoản Nhanh 24/7
              </span>
              <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VietQR_Demo_noshop_Order_${orderSuccess.orderCode}_${orderSuccess.totalAmount}`}
                  alt="VietQR code"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-xs text-slate-700 space-y-1.5 bg-white p-3 rounded-xl border border-gray-100 max-w-sm mx-auto">
                <div className="flex justify-between items-center">
                  <span>Ngân hàng: <strong>Techcombank</strong></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Số TK: <strong>1903688888</strong></span>
                  <button onClick={() => copyToClipboard('1903688888', 'Số tài khoản')} className="text-[#f04438] hover:opacity-80"><Copy className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chủ TK: <strong>NGUYEN HOANG MINH</strong></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nội dung: <strong className="text-red-600">{orderSuccess.orderCode}</strong></span>
                  <button onClick={() => copyToClipboard(orderSuccess.orderCode, 'Nội dung chuyển khoản')} className="text-[#f04438] hover:opacity-80"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/orders"
              className="flex-1 py-3 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold transition shadow"
            >
              Xem Đơn Hàng Của Tôi
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Địa Chỉ Nhận Hàng & Thanh Toán
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Delivery info & payment options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600" />
              Địa Chỉ Giao Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ví dụ: 150 Cầu Giấy, Quan Hoa, Cầu Giấy"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tỉnh / Thành phố
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú giao hàng
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Giao giờ hành chính..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'COD' ? 'border-red-600 bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Nhận hàng trước, kiểm tra và thanh toán tiền mặt trực tiếp cho shipper.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'BANK_TRANSFER' ? 'border-red-600 bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-red-600" />
                    Chuyển khoản Ngân Hàng / Quét Mã VietQR (Khuyên dùng)
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Hỗ trợ tất cả ứng dụng ngân hàng và ví điện tử, tự động khớp lệnh nhanh chóng.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
              Đơn Hàng ({cart.length} sản phẩm)
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <Image
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-gray-400">x{quantity}</p>
                  </div>
                  <div className="font-bold text-gray-900 shrink-0">
                    {formatPrice(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tiền hàng:</span>
                <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Vận chuyển:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí (Freeship)</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-xl font-black text-[#f04438]">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:from-[#c2410c] hover:to-[#d92d20] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Đang xử lý...' : 'Đặt Hàng Ngay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
