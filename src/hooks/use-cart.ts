// hooks/use-cart.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_COOKIE_KEY = 'cart_items';

const saveCartItemsToCookie = (items: CartItem[]) => {
  Cookies.set(CART_COOKIE_KEY, JSON.stringify(items), { expires: 7 }); // Cookies expire in 7 days
};

const loadCartItemsFromCookie = (): CartItem[] => {
  const cookie = Cookies.get(CART_COOKIE_KEY);
  return cookie ? JSON.parse(cookie) : [];
};

export const useCart = create<CartStore>((set) => ({
  items: loadCartItemsFromCookie(),
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      const updatedItems = existingItem
        ? state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1, additions: product.additions, observation: product.observation }
              : item
          )
        : [...state.items, { ...product, product, quantity: 1 }];

      saveCartItemsToCookie(updatedItems);
      return { items: updatedItems };
    }),
  removeFromCart: (productId) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== productId);
      saveCartItemsToCookie(updatedItems);
      return { items: updatedItems };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCartItemsToCookie(updatedItems);
      return { items: updatedItems };
    }),
  clearCart: () => {
    saveCartItemsToCookie([]);
    return { items: [] };
  },
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
  additions?: Addition[];
  observation?: string;
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

export interface Addition {
  id: string;
  name: string;
  price: number;
}