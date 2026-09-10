export type ItemCategory = 'all' | 'food' | 'drinks' | 'cocktails' | 'beer' | 'soft-drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // In Ghanaian Cedis (GH₵)
  category: 'food' | 'drinks' | 'cocktails' | 'beer' | 'soft-drinks';
  available: boolean;
  image?: string;
  badge?: string; // e.g. "Signature", "Spicy", "Popular"
  prepTimeMinutes?: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatusType = 'received' | 'preparing' | 'ready' | 'completed';
export type PaymentStatusType = 'pending' | 'paid' | 'failed';
export type PaymentMethodType = 'momo' | 'card' | 'cash';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number | string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  momoNetwork?: 'mtn' | 'telecel' | 'at';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  tableNumber: string | number;
}
