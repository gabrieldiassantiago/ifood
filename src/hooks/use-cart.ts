'use client';

import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { ...product, product, quantity: 1 }],
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  availability: boolean;
}

export interface CartItem extends Product {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  deliveryType: 'delivery' | 'pickup';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface OrderStatus {
  id: number;
  status: 'PENDENTE' | 'PREPARANDO' | 'ENVIADO' | 'CANCELADO';
  timestamp: Date;
}

export interface EntregasBairros {
  id: string;
  name: string;
  value: number;
}

export interface Order {
  id: string;
  products: CartItem[];
  total: number;
  address: string;
  paymentMethod: string;
  name: string;
  phone: string;
  status: 'PENDENTE' | 'PREPARANDO' | 'ENVIADO' | 'CANCELADO';
  deliveryMethod: string;
  neighborhoodId?: string;
  changeFor?: number;
}