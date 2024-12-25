// types.ts
export interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
  address: string;
  paymentMethod: string;
  deliveryMethod: string;
  products: OrderProduct[];
  updatedAt?: string;
  
}
