'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  Store,
  ShieldAlert,
  ChevronDown,
  Bell,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [keyword, setKeyword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hotKeywords = [
    'iPhone 16 Pro Max',
    'MacBook M3 Pro',
    'Samsung S24 Ultra',
    'Sony WH-1000XM5',
    'AirPods Pro 2',
    'Áo Blazer Nam',
    'Dreame L20 Ultra'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleKeywordClick = (kw: string) => {
    setKeyword(kw);
    router.push(`/products?keyword=${encodeURIComponent(kw)}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* 1. Top Bar */}
      <div className="bg-[#1e2329] text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/seller/dashboard" className="hover:text-[#f04438] transition font-medium">
              Kênh Người Bán
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link href="/register" className="hover:text-white transition hidden sm:inline">
              Mở Gian Hàng noshop
            </Link>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              Hệ thống bán hàng trực tuyến noshop.vn
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center gap-1 hover:text-white cursor-pointer transition">
              <Bell className="w-3.5 h-3.5" />
              <span>Thông Báo</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 hover:text-white cursor-pointer transition">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Trợ Giúp</span>
            </div>
            {user ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {user.name} ({user.role.toUpperCase()})
              </span>
            ) : (
              <div className="flex items-center space-x-2 font-semibold">
                <Link href="/login" className="hover:text-white transition">
                  Đăng nhập
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/register" className="hover:text-white transition">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Orange-Red Theme like nodesign.vn) */}
      <div className="bg-gradient-to-r from-[#ea580c] via-[#f04438] to-[#e11d48] text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-white text-[#f04438] flex items-center justify-center shadow transition-transform duration-200 group-hover:scale-105">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                  no<span className="text-amber-200">shop</span>
                </span>
                <span className="text-[10px] font-bold uppercase bg-white/20 text-white px-1.5 py-0.5 rounded tracking-wider">
                  MALL
                </span>
              </div>
              <span className="block text-[10px] text-white/80 font-normal tracking-wide">
                Sàn thương mại điện tử
              </span>
            </div>
          </Link>

          {/* Search Box & Quick Keywords */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, thương hiệu hoặc nhà bán lẻ..."
                className="w-full pl-4 pr-24 py-2.5 rounded-full bg-white text-gray-900 placeholder-gray-400 text-xs sm:text-sm focus:outline-none shadow-sm border border-transparent focus:border-amber-300"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-5 bg-[#1e2329] hover:bg-black text-white rounded-full font-bold text-xs flex items-center justify-center transition"
              >
                <Search className="w-3.5 h-3.5 mr-1" />
                <span>Tìm kiếm</span>
              </button>
            </form>

            {/* Hot search tags */}
            <div className="flex items-center space-x-3 mt-1.5 overflow-x-auto text-[11px] text-white/90 font-normal no-scrollbar">
              <span className="text-amber-200 font-semibold shrink-0">
                Xu hướng:
              </span>
              {hotKeywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => handleKeywordClick(kw)}
                  className="hover:text-amber-200 transition shrink-0 whitespace-nowrap"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {user?.role === 'seller' && (
              <Link
                href="/seller/dashboard"
                className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition"
              >
                <Store className="w-4 h-4" />
                <span>Kênh Người Bán</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Quản Trị Hệ Thống</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition flex items-center justify-center"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1e2329] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#f04438]">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition text-xs text-white"
                >
                  <div className="w-7 h-7 rounded-lg bg-white text-[#f04438] font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                </button>

                {isUserMenuOpen && (
                  <div
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 text-slate-800"
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-[#ea580c]">
                        Vai trò: {user.role}
                      </span>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Đơn hàng của tôi</span>
                    </Link>

                    {user.role === 'seller' && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-[#ea580c] hover:bg-orange-50 transition"
                      >
                        <Store className="w-4 h-4" />
                        <span className="font-bold">Kênh Người Bán</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span className="font-bold">Trang Quản Trị</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        router.push('/');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left border-t border-gray-100 mt-1 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/20 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-4 pr-12 py-2 rounded-xl bg-white text-gray-900 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#1e2329] text-white rounded-lg text-xs font-bold"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Category Links */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 no-scrollbar">
          <div className="flex items-center space-x-6 shrink-0">
            <Link href="/" className="text-[#f04438] hover:text-[#ea580c] transition font-bold">
              Trang Chủ
            </Link>
            <Link href="/products" className="hover:text-[#f04438] transition">
              Tất Cả Sản Phẩm
            </Link>
            <Link href="/products?category=dien-thoai-tablet" className="hover:text-[#f04438] transition">
              Điện Thoại & Tablet
            </Link>
            <Link href="/products?category=laptop-may-tinh" className="hover:text-[#f04438] transition">
              Laptop & Máy Tính
            </Link>
            <Link href="/products?category=thiet-bi-am-thanh" className="hover:text-[#f04438] transition">
              Thiết Bị Âm Thanh
            </Link>
            <Link href="/products?category=dong-ho-vong-deo" className="hover:text-[#f04438] transition">
              Đồng Hồ Thông Minh
            </Link>
            <Link href="/products?category=thoi-trang-phu-kien" className="hover:text-[#f04438] transition">
              Thời Trang
            </Link>
            <Link href="/products?category=gia-dung-thong-minh" className="hover:text-[#f04438] transition">
              Gia Dụng Thông Minh
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4 shrink-0 text-[11px] text-[#ea580c] font-bold">
            <span>Sản phẩm chính hãng 100%</span>
            <span>Miễn phí vận chuyển</span>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-3 text-xs font-semibold animate-in slide-in-from-top-2">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#f04438]">Trang Chủ</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700">Tất Cả Sản Phẩm</Link>
          <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700">Đơn Hàng Của Tôi</Link>
          {user?.role === 'seller' && (
            <Link href="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-600">Kênh Người Bán</Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-red-600">Trang Quản Trị</Link>
          )}
        </div>
      )}
    </header>
  );
};
