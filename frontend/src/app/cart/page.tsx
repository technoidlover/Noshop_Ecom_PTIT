'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/api';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Ticket, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NOSHOP50K' || code === 'MINHTECH50K') {
      setDiscount(50000);
      setAppliedCoupon(code);
      showToast('Áp dụng mã giảm giá 50.000đ thành công!', 'success');
    } else if (code === 'FREESHIP') {
      showToast('Áp dụng mã Miễn Phí Vận Chuyển thành công!', 'success');
      setAppliedCoupon(code);
    } else {
      showToast('Mã giảm giá không hợp lệ. Thử mã: NOSHOP50K', 'error');
    }
  };

  const finalTotal = Math.max(0, totalPrice - discount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-orange-50 text-[#f04438] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Hãy khám phá hàng ngàn sản phẩm công nghệ và phụ kiện chính hãng với ưu đãi noshop Mall ngay hôm nay.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <span>Mua Sắm Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Có <strong className="text-gray-900">{totalItems}</strong> sản phẩm trong giỏ
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            showToast('Đã xóa tất cả sản phẩm khỏi giỏ hàng', 'info');
          }}
          className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs"
            >
              {/* Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link
                  href={`/products/${product._id}`}
                  className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#f04438] transition line-clamp-2"
                >
                  {product.name}
                </Link>
                <div className="text-xs text-red-600 font-bold mt-1">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  onClick={() => updateQuantity(product._id, quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition font-bold text-xs"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-gray-800 min-w-[32px] text-center bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product._id, quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition font-bold text-xs"
                >
                  +
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="text-sm font-black text-red-600">
                  {formatPrice(product.price * quantity)}
                </div>
                <button
                  onClick={() => {
                    removeFromCart(product._id);
                    showToast('Đã bỏ sản phẩm khỏi giỏ hàng', 'info');
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#f04438] hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục mua sắm thêm sản phẩm</span>
          </Link>
        </div>

        {/* Right: Shopee/Tiki Voucher & Order Summary */}
        <div className="space-y-4">
          {/* Voucher Box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-[#ea580c]" />
              noshop Voucher / Mã Ưu Đãi
            </span>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã (VD: NOSHOP50K)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                Áp Dụng
              </button>
            </form>

            {appliedCoupon && (
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã áp dụng mã: {appliedCoupon}</span>
              </div>
            )}
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
              Chi Tiết Thanh Toán
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí (Freeship 0Đ)</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
                <span className="text-xl font-black text-[#f04438]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:from-[#c2410c] hover:to-[#d92d20] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Mua Hàng ({totalItems})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              Nhấn &quot;Mua Hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản noshop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
