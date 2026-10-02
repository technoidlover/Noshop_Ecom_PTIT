import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#fbfbfb] text-slate-700 mt-16 border-t-4 border-[#f04438]">
      {/* 4 Brand Pillars (Shopee/Tiki style) */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-100">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">7 Ngày Miễn Phí Trả Hàng</h4>
              <p className="text-[11px] text-gray-500">Trả hàng miễn phí 100%</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">100% Hàng Chính Hãng</h4>
              <p className="text-[11px] text-gray-500">Bảo đảm nguồn gốc xuất xứ</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Miễn Phí Vận Chuyển</h4>
              <p className="text-[11px] text-gray-500">Giao hàng nhanh toàn quốc</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Hỗ Trợ 24/7</h4>
              <p className="text-[11px] text-gray-500">Hotline: 0901.234.567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">CHĂM SÓC KHÁCH HÀNG</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/" className="hover:text-[#ea580c] transition">Trung Tâm Trợ Giúp</Link></li>
            <li><Link href="/" className="hover:text-[#ea580c] transition">noshop Blog</Link></li>
            <li><Link href="/orders" className="hover:text-[#ea580c] transition">Hướng Dẫn Mua Hàng</Link></li>
            <li><Link href="/orders" className="hover:text-[#ea580c] transition">Chính Sách Vận Chuyển</Link></li>
            <li><Link href="/orders" className="hover:text-[#ea580c] transition">Chính Sách Bảo Hành</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">VỀ NOSHOP</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/" className="hover:text-[#ea580c] transition">Giới Thiệu noshop</Link></li>
            <li><Link href="/" className="hover:text-[#ea580c] transition">Tuyển Dụng</Link></li>
            <li><Link href="/" className="hover:text-[#ea580c] transition">Điều Khoản Sử Dụng</Link></li>
            <li><Link href="/" className="hover:text-[#ea580c] transition">Chính Sách Bảo Mật</Link></li>
            <li><Link href="/" className="hover:text-[#ea580c] transition">Chính Hãng noshop Mall</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">THANH TOÁN</h4>
          <div className="grid grid-cols-3 gap-2">
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center">VISA</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center">Master</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center">JCB</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center text-[#ea580c]">VietQR</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center text-pink-600">MoMo</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-bold text-center text-blue-600">COD</span>
          </div>

          <h4 className="font-bold text-gray-900 uppercase tracking-wider mt-6 mb-3">ĐƠN VỊ VẬN CHUYỂN</h4>
          <div className="grid grid-cols-2 gap-2">
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-semibold text-center">SPX Express</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-semibold text-center">GHN Express</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-semibold text-center">Viettel Post</span>
            <span className="p-2 bg-white rounded border border-gray-200 text-[10px] font-semibold text-center">Ninja Van</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">THEO DÕI CHÚNG TÔI</h4>
          <ul className="space-y-2 text-gray-500">
            <li><span className="hover:text-[#ea580c] cursor-pointer">Facebook</span></li>
            <li><span className="hover:text-[#ea580c] cursor-pointer">Instagram</span></li>
            <li><span className="hover:text-[#ea580c] cursor-pointer">LinkedIn</span></li>
            <li><span className="hover:text-[#ea580c] cursor-pointer">TikTok</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">TẢI ỨNG DỤNG NOSHOP</h4>
          <p className="text-[11px] text-gray-500 mb-3">Quét mã QR để tải ứng dụng trải nghiệm mua sắm nhanh chóng và nhận voucher 100K</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white border border-gray-200 rounded-xl text-center font-mono text-[9px] font-bold">
              [QR App]
            </div>
            <div className="space-y-1.5">
              <span className="block px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold">App Store</span>
              <span className="block px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold">Google Play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="border-t border-gray-200 py-6 text-center text-[11px] text-gray-500 space-y-1.5 bg-gray-50">
        <div className="flex justify-center items-center space-x-4">
          <span>CHÍNH SÁCH BẢO MẬT</span>
          <span>•</span>
          <span>QUY CHẾ HOẠT ĐỘNG</span>
          <span>•</span>
          <span>CHÍNH SÁCH VẬN CHUYỂN</span>
          <span>•</span>
          <span>CHÍNH SÁCH TRẢ HÀNG & HOÀN TIỀN</span>
        </div>
        <p className="text-gray-400">
          Công ty Cổ Phần Thương Mại Điện Tử noshop - Địa chỉ: Tòa nhà noshop, Cầu Giấy, Hà Nội.
        </p>
        <p className="text-gray-400">
          © 2026 - Bản quyền thuộc về noshop E-Commerce Platform. Server IP: 150.95.104.244
        </p>
      </div>
    </footer>
  );
};
