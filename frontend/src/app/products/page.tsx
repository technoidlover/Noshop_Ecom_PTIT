'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const keyword = searchParams.get('keyword') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (selectedCategory) params.set('category', selectedCategory);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, selectedCategory, sort, page, minPrice, maxPrice]);

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    // Reset to page 1 on filter changes
    if (!newParams.page) {
      current.set('page', '1');
    }
    router.push(`/products?${current.toString()}`);
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({
      minPrice: priceRange.min || null,
      maxPrice: priceRange.max || null
    });
  };

  const handleResetFilters = () => {
    setPriceRange({ min: '', max: '' });
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Tất Cả Sản Phẩm'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Hiển thị {products.length} trên tổng số {total} sản phẩm
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 font-medium">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => updateQueryParams({ sort: e.target.value })}
            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="newest">Mới nhất</option>
            <option value="sold">Bán chạy nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#f04438]" /> Bộ Lọc Tìm Kiếm
              </span>
              {(selectedCategory || minPrice || maxPrice || keyword) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Danh Mục Ngành Hàng
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => updateQueryParams({ category: null })}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    !selectedCategory ? 'bg-orange-50 text-[#f04438] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateQueryParams({ category: cat._id })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat._id
                        ? 'bg-orange-50 text-[#f04438] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                Khoảng Giá (VNĐ)
              </h3>
              <form onSubmit={handleApplyPrice} className="space-y-2">
                <input
                  type="number"
                  placeholder="Từ (đ)"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Đến (đ)"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  Áp Dụng
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Products Content */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pt-6">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateQueryParams({ page: (page - 1).toString() })}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Trang trước
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => updateQueryParams({ page: p.toString() })}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                          page === p
                            ? 'bg-[#f04438] text-white shadow-sm'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => updateQueryParams({ page: (page + 1).toString() })}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-gray-500 mt-1">Hãy thử tìm với từ khóa khác hoặc điều chỉnh lại bộ lọc</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f04438] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow"
              >
                Khôi phục tất cả
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-gray-500">Đang tải sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
