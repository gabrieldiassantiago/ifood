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

export interface OrderRequest {
  products: { productId: string; quantity: number }[];
  address: string;
  paymentMethod: string;
  name: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
  neighborhoodId?: string;
  changeFor?: number;
  total: number;
}