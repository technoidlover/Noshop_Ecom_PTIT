'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import {
  Flame,
  Truck,
  Ticket,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Tag,
  Gift,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=18'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by selected tab
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => {
        const cId = typeof p.category === 'object' ? p.category._id : p.category;
        return cId === activeTab;
      });

  const quickFeatures = [
    { label: 'Freeship Xtra', icon: Truck, color: 'from-emerald-500 to-teal-600', href: '/products' },
    { label: 'Mã Giảm Giá', icon: Ticket, color: 'from-amber-500 to-orange-600', href: '/products' },
    { label: 'noshop Mall', icon: ShieldCheck, color: 'from-[#ea580c] to-[#f04438]', href: '/products' },
    { label: 'Flash Sale 50%', icon: Flame, color: 'from-[#ea580c] to-[#e11d48]', href: '/products' },
    { label: 'Hàng Hiệu 0Đ', icon: Tag, color: 'from-purple-500 to-indigo-600', href: '/products' },
    { label: 'Đổi Trả 7 Ngày', icon: RotateCcw, color: 'from-rose-500 to-red-600', href: '/products' },
    { label: 'Deal Siêu Rẻ', icon: Zap, color: 'from-amber-500 to-[#ea580c]', href: '/products' },
    { label: 'Quà Tặng VIP', icon: Gift, color: 'from-pink-500 to-rose-500', href: '/products' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Shopee/Tiki Style Hero Banners (Main 2/3 + 2 Sub 1/3) */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Big Banner */}
          <div className="lg:col-span-2 relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-sm group">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80"
              alt="MacBook Pro Banner"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent p-6 sm:p-10 flex flex-col justify-center text-white space-y-3">
              <span className="inline-block px-3 py-1 bg-[#f04438] text-white text-xs font-black rounded-full uppercase tracking-wider w-fit">
                Siêu Đại Hội Công Nghệ
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight max-w-md">
                MacBook Pro M3 & iPhone 16 Pro Max
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-sm">
                Ưu đãi giảm giá tới 5.000.000đ, tặng kèm gói bảo hành rơi vỡ chính hãng 12 tháng.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <span>Săn Deal Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2 Sub Banners on the right */}
          <div className="flex flex-col gap-3 h-64 sm:h-72 md:h-80">
            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"
                alt="Galaxy AI Banner"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase">Quyền Năng Galaxy AI</span>
                <h3 className="font-bold text-sm">Samsung Galaxy S24 Ultra</h3>
                <p className="text-[11px] text-slate-300">Tặng voucher 3 triệu</p>
              </div>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                alt="Sony Audio Banner"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-amber-200 uppercase">Âm Thanh Đỉnh Cao</span>
                <h3 className="font-bold text-sm">Sony WH-1000XM5 Hi-Res</h3>
                <p className="text-[11px] text-slate-300">Chống ồn chủ động số 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shopee/Tiki Style Quick Utilities 8 Icons Row */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 text-center">
            {quickFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 mt-2 leading-tight group-hover:text-[#ea580c] transition">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Shopee/Lazada Signature Flash Sale Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Flash Sale Header Bar */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#ea580c] via-[#f04438] to-[#e11d48] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 font-black text-lg sm:text-xl tracking-wider uppercase">
                <Flame className="w-6 h-6 text-amber-300" />
                <span>FLASH SALE</span>
              </div>

              {/* Countdown timer blocks */}
              <div className="flex items-center space-x-1 text-xs font-black">
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md shadow-xs">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md shadow-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md shadow-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-white hover:text-yellow-200 flex items-center gap-1 transition"
            >
              Xem Tất Cả &gt;
            </Link>
          </div>

          {/* Flash Sale Items Grid */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} variant="flash-sale" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shopee/Tiki Style Category Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wider">
              Danh Mục Ngành Hàng
            </h2>
            <Link href="/products" className="text-xs font-bold text-[#ea580c] hover:underline">
              Xem tất cả &gt;
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group flex flex-col items-center p-3 rounded-xl hover:bg-orange-50/50 hover:border-orange-200 border border-transparent transition text-center"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-50 mb-2 border border-gray-100 group-hover:scale-105 transition duration-300">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-[#ea580c] transition line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Shopee/Tiki Style: "GỢI Ý HÔM NAY" (Daily Discover) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Section Tab Header */}
          <div className="sticky top-[106px] z-40 bg-white border-b border-gray-200 px-4 flex items-center overflow-x-auto gap-2 no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3.5 px-4 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'all'
                  ? 'border-[#f04438] text-[#f04438]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              GỢI Ý HÔM NAY
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveTab(c._id)}
                className={`py-3.5 px-4 text-xs font-bold shrink-0 border-b-2 transition ${
                  activeTab === c._id
                    ? 'border-[#f04438] text-[#f04438]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} variant="standard" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-gray-400">
                Chưa có sản phẩm nào thuộc danh mục này.
              </div>
            )}

            <div className="text-center mt-8 pt-4 border-t border-gray-100">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-white border-2 border-[#f04438] text-[#f04438] hover:bg-[#f04438] hover:text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Xem thêm nhiều sản phẩm khác
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
