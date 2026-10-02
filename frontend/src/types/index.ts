export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  phone?: string;
  address?: string;
  shop?: {
    name: string;
    description?: string;
    phone?: string;
    address?: string;
    logo?: string;
  };
  isActive?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  category: Category | string;
  seller: {
    _id: string;
    name: string;
    email?: string;
    shop?: {
      name: string;
      description?: string;
      logo?: string;
      address?: string;
      phone?: string;
    };
  };
  images: string[];
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt?: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: string | { _id: string; name: string };
}

export interface Order {
  _id: string;
  orderCode: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city?: string;
    note?: string;
  };
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  paymentStatus: 'UNPAID' | 'PAID';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  buyer: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}
