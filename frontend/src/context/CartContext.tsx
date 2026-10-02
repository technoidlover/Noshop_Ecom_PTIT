'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product._id === product._id);
    let newCart: CartItem[];

    if (existingIndex > -1) {
      newCart = [...cart];
      const newQty = newCart[existingIndex].quantity + quantity;
      newCart[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      newCart = [...cart, { product, quantity: Math.min(quantity, product.stock) }];
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product._id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) => {
      if (item.product._id === productId) {
        return { ...item, quantity: Math.min(quantity, item.product.stock) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
