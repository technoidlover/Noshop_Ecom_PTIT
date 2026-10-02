'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Star, ShoppingCart, Truck, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'flash-sale';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'standard' }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const shopCity =
    typeof product.seller === 'object' && product.seller?.shop?.address
      ? product.seller.shop.address.split(',').pop()?.trim() || 'Hà Nội'
      : 'Hà Nội';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      showToast(`Đã thêm "${product.name.slice(0, 28)}..." vào giỏ hàng`, 'success');
    }
  };

  // Flash Sale variant
  if (variant === 'flash-sale') {
    const soldRatio = Math.min(
      100,
      Math.max(25, Math.round((product.sold / ((product.sold + product.stock) || 1)) * 100))
    );

    return (
      <Link
        href={`/products/${product._id}`}
        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#f04438]/80 transition-all duration-200 flex flex-col justify-between relative hover:-translate-y-0.5"
      >
        <div>
          {/* Thumbnail & Badges */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-1.5 left-1.5 flex flex-col space-y-1">
              <span className="bg-[#f04438] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                Mall
              </span>
            </div>

            {/* Discount Ribbon */}
            {discountPercent && (
              <div className="absolute top-0 right-1.5 bg-amber-400 text-red-700 text-center px-1.5 py-0.5 rounded-b-md shadow-xs font-black text-[10px] leading-tight">
                <span>-{discountPercent}%</span>
              </div>
            )}

            {/* Stock state */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-slate-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
                  Hết Hàng
                </span>
              </div>
            )}
          </div>

          {/* Flash Sale Content */}
          <div className="p-2.5">
            <h3 className="text-xs font-semibold text-gray-900 group-hover:text-[#f04438] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-1.5 flex items-baseline gap-1 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#f04438]">
                {formatPrice(product.price)}
              </span>
              {discountPercent && product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Shopee Style Flash Sale Flame Progress Bar */}
            <div className="mt-2.5 relative w-full h-4 bg-orange-100 rounded-full overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#ea580c] to-[#f04438] rounded-full transition-all duration-500"
                style={{ width: `${soldRatio}%` }}
              />
              <span className="relative z-10 text-[9px] font-extrabold text-white uppercase tracking-tight flex items-center gap-0.5 drop-shadow-xs">
                <Flame className="w-2.5 h-2.5 fill-amber-200 text-amber-200 shrink-0" />
                <span>ĐÃ BÁN {product.sold}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard variant
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#f04438]/60 transition-all duration-200 flex flex-col justify-between relative hover:-translate-y-0.5">
      <div>
        {/* Thumbnail & Badges */}
        <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Clean Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            <span className="bg-[#f04438] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              noshop Mall
            </span>
            <span className="bg-[#0284c7] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
              <Truck className="w-2.5 h-2.5" /> Freeship
            </span>
          </div>

          {/* Discount Ribbon */}
          {discountPercent && (
            <div className="absolute top-0 right-2 bg-amber-400 text-red-700 text-center px-1.5 py-1 rounded-b-md shadow-xs font-bold text-[10px] leading-tight">
              <span>-{discountPercent}%</span>
            </div>
          )}

          {/* Stock state */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                Hết Hàng
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-3">
          <Link href={`/products/${product._id}`}>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#f04438] transition-colors line-clamp-2 min-h-[36px] leading-snug">
              <span className="inline-block px-1 py-0.2 mr-1 text-[9px] font-bold text-[#f04438] border border-[#f04438] rounded bg-red-50">
                Chính Hãng
              </span>
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#f04438]">
              {formatPrice(product.price)}
            </span>
            {discountPercent && product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating & Sold */}
          <div className="flex items-center justify-between text-[11px] mt-2 text-gray-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[11px] font-semibold text-gray-700 ml-0.5">{product.rating}</span>
            </div>
            <span className="text-gray-400">Đã bán {product.sold > 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-3 pt-1 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 truncate max-w-[110px]">
          {shopCity}
        </span>

        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="p-1.5 rounded-lg bg-orange-50 text-[#f04438] hover:bg-[#f04438] hover:text-white transition disabled:opacity-40"
          title="Thêm vào giỏ"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
