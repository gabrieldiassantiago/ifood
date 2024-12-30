// services/api.ts
import axios from 'axios';
import { Category, EntregasBairros, Order, OrderRequest, Product, Addition } from '../types/order';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getProducts = () => api.get<Product[]>('/products');
export const getCategories = () => api.get<Category[]>('/categories');
export const getNeighborhoods = () => api.get<EntregasBairros[]>('/neighborhoods');
export const createOrder = async (orderData: OrderRequest) => {
  const response = await api.post('/orders', orderData);
  return response;
};
export const getOrders = () => api.get<Order[]>('/orders');
export const getOrder = (orderId: string) => api.get<Order>(`/orders/${orderId}`);
export const getOrdersByPhone = (phone: string) => api.get<Order[]>(`/orders/status/${phone}`);
export const getAdditions = () => api.get<Addition[]>('/addition');

export default api;