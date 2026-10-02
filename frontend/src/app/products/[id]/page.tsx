'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api, { formatPrice } from '@/lib/api';
import { Product, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  MessageSquare,
  Send,
  Ticket,
  CheckCircle2,
  Heart,
  Share2
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // New review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        if (prodRes.data.images && prodRes.data.images.length > 0) {
          setSelectedImage(prodRes.data.images[0]);
        }
        setReviews(revRes.data || []);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndReviews();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        productId: id,
        rating,
        comment
      });
      setReviews([res.data.review, ...reviews]);
      setComment('');
      showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Không thể gửi đánh giá.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 text-xs">
        Đang tải thông tin chi tiết sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-[#f04438] font-semibold hover:underline text-xs">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Shopee Style Breadcrumbs */}
      <div className="text-xs text-gray-500 flex items-center space-x-2">
        <Link href="/" className="hover:text-[#f04438]">Trang Chủ</Link>
        <span>&gt;</span>
        <Link href="/products" className="hover:text-[#f04438]">Sản Phẩm</Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-medium truncate max-w-md">{product.name}</span>
      </div>

      {/* Main Product Presentation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={selectedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {discountPercent && (
              <span className="absolute top-3 left-3 bg-[#f04438] text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-xs">
                GIẢM {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-[#f04438] ring-2 ring-red-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Share & Wishlist quick bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span>Chia sẻ:</span>
              <button className="text-slate-600 hover:text-[#f04438]"><Share2 className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center space-x-1 text-[#f04438] hover:opacity-80">
              <Heart className="w-4 h-4 fill-current" />
              <span>Đã thích (1.5k)</span>
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Information & Buy Box */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#f04438] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Yêu Thích+
              </span>
              <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Chính Hãng
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating, Reviews and Sold Row */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center text-amber-500 border-b border-amber-500 pb-0.5">
                <span className="font-black text-sm text-gray-900 mr-1">{product.rating}</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-gray-600">
                <strong className="text-gray-900">{product.numReviews}</strong> Đánh Giá
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-gray-600">
                <strong className="text-gray-900">{product.sold}</strong> Đã Bán
              </div>
            </div>

            {/* Shopee Style Red Price Block */}
            <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-black text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[11px] font-bold text-red-600 uppercase bg-red-100 px-1.5 py-0.5 rounded">
                    -{discountPercent}% Giảm
                  </span>
                </>
              )}
            </div>

            {/* Shopee Voucher and Promotion Box */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-24 text-gray-500 shrink-0 font-medium">Mã Giảm Giá Sàn:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold text-[11px]">
                    Giảm 50K
                  </span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded font-semibold text-[11px]">
                    Giảm 10%
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-[11px]">
                    Freeship 0Đ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-24 text-gray-500 shrink-0 font-medium">Vận Chuyển:</span>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 0đ</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-24 text-gray-500 shrink-0 font-medium">noshop Đảm Bảo:</span>
                <div className="flex items-center gap-2 text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
                  <span>3 Ngày Trả Hàng / Hoàn Tiền 100%</span>
                </div>
              </div>
            </div>

            {/* Quantity Picker */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="w-24 text-xs font-medium text-gray-500 shrink-0">Số Lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1 text-gray-600 hover:bg-gray-200 transition font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-semibold text-gray-800 bg-white min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-1 text-gray-600 hover:bg-gray-200 transition font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">{product.stock} sản phẩm có sẵn</span>
            </div>

            {/* Action Buttons: Shopee Style */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 rounded-xl border-2 border-[#f04438] bg-orange-50/60 text-[#f04438] hover:bg-orange-100 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:from-[#c2410c] hover:to-[#d92d20] text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-40"
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shopee Style Shop Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-orange-100 text-[#ea580c] flex items-center justify-center font-black text-xl border border-gray-100 shrink-0">
            <Store className="w-8 h-8 text-[#ea580c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-900">
                {typeof product.seller === 'object' && product.seller?.shop?.name
                  ? product.seller.shop.name
                  : product.seller?.name || 'Gian Hàng Chính Hãng'}
              </h3>
              <span className="px-1.5 py-0.2 bg-orange-50 text-[#ea580c] border border-orange-200 text-[10px] font-bold rounded">
                Yêu Thích
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Online 5 phút trước</p>
            <div className="flex items-center space-x-2 mt-2">
              <Link
                href={`/products?seller=${typeof product.seller === 'object' ? product.seller._id : product.seller}`}
                className="px-3 py-1 bg-orange-50 text-[#ea580c] rounded-lg text-xs font-semibold hover:bg-orange-100 transition"
              >
                Xem Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Shop stats grid */}
        <div className="grid grid-cols-3 gap-6 text-xs border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 text-gray-500">
          <div>
            <span>Đánh Giá:</span> <strong className="text-[#ea580c] block sm:inline">4.9 (1.8k)</strong>
          </div>
          <div>
            <span>Sản Phẩm:</span> <strong className="text-[#ea580c] block sm:inline">35</strong>
          </div>
          <div>
            <span>Tỉ Lệ Phản Hồi:</span> <strong className="text-[#ea580c] block sm:inline">99%</strong>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
            Chi Tiết Sản Phẩm & Mô Tả
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pt-4">
            {product.description}
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#f04438]" />
            Đánh Giá Sản Phẩm ({reviews.length})
          </h2>

          {user ? (
            <form onSubmit={handleSubmitReview} className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-800 block">Viết nhận xét của bạn</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chất lượng sản phẩm tuyệt vời, giao hàng nhanh..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                required
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Đang gửi...' : 'Gửi Nhận Xét'}</span>
              </button>
            </form>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
              Vui lòng <Link href="/login" className="text-[#f04438] font-bold hover:underline">Đăng nhập</Link> để đánh giá sản phẩm.
            </div>
          )}

          <div className="space-y-3 pt-2">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-3.5 rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-bold text-gray-900">{rev.buyer?.name || 'Khách hàng'}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
