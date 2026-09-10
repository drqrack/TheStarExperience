/**
 * API Abstraction Layer for The Star Experience
 * 
 * NOTE: For now, this module uses mock data and browser localStorage.
 * When the backend is implemented, these functions will be switched to call FastAPI REST endpoints.
 * 
 * Future FastAPI Endpoints:
 * - GET    /api/menu                   -> Fetch active menu
 * - POST   /api/menu                   -> Add menu item (Admin)
 * - PUT    /api/menu/{id}              -> Update menu item (Admin)
 * - DELETE /api/menu/{id}              -> Delete menu item (Admin)
 * - GET    /api/orders                 -> List orders (Admin)
 * - POST   /api/orders                 -> Create new order (Customer)
 * - GET    /api/orders/{id}            -> Fetch specific order tracking details
 * - PATCH  /api/orders/{id}/status     -> Update order status (Admin)
 * - POST   /api/payments/initialize    -> Initialize Paystack / Hubtel transaction
 * - POST   /api/payments/webhook       -> Webhook for payment verification
 * - WS     /ws/orders/{id}             -> Real-time WebSocket order tracking
 * - WS     /ws/admin/orders            -> Real-time WebSocket staff notifications
 */

import { MenuItem, Order, OrderStatusType } from '@/types';
import { INITIAL_MENU } from '@/data/menu';
import { INITIAL_ORDERS } from '@/data/orders';

const MENU_STORAGE_KEY = 'star_experience_menu';
const ORDERS_STORAGE_KEY = 'star_experience_orders';

// Helper to access localStorage safely in SSR
function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for cross-component sync in same tab
    window.dispatchEvent(new Event(`storage_${key}`));
  } catch (err) {
    console.error(`Failed saving to localStorage ${key}:`, err);
  }
}

/**
 * Fetch all menu items
 * // TODO: Replace with fetch(`${FASTAPI_URL}/api/menu`)
 */
export async function getMenu(): Promise<MenuItem[]> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 50));
  return getStoredData<MenuItem[]>(MENU_STORAGE_KEY, INITIAL_MENU);
}

/**
 * Save or update a menu item
 * // TODO: Replace with POST/PUT `${FASTAPI_URL}/api/menu`
 */
export async function saveMenuItem(item: MenuItem): Promise<MenuItem> {
  const current = getStoredData<MenuItem[]>(MENU_STORAGE_KEY, INITIAL_MENU);
  const exists = current.some((i) => i.id === item.id);
  const updated = exists
    ? current.map((i) => (i.id === item.id ? item : i))
    : [item, ...current];
  setStoredData(MENU_STORAGE_KEY, updated);
  return item;
}

/**
 * Toggle menu item availability
 * // TODO: Replace with PATCH `${FASTAPI_URL}/api/menu/{id}/availability`
 */
export async function toggleItemAvailability(id: string, available: boolean): Promise<MenuItem | null> {
  const current = getStoredData<MenuItem[]>(MENU_STORAGE_KEY, INITIAL_MENU);
  let updatedItem: MenuItem | null = null;
  const updated = current.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, available };
      return updatedItem;
    }
    return item;
  });
  setStoredData(MENU_STORAGE_KEY, updated);
  return updatedItem;
}

/**
 * Delete a menu item
 * // TODO: Replace with DELETE `${FASTAPI_URL}/api/menu/{id}`
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
  const current = getStoredData<MenuItem[]>(MENU_STORAGE_KEY, INITIAL_MENU);
  const updated = current.filter((item) => item.id !== id);
  setStoredData(MENU_STORAGE_KEY, updated);
  return true;
}

/**
 * Fetch all orders (Bar Admin)
 * // TODO: Replace with fetch(`${FASTAPI_URL}/api/orders`)
 */
export async function getOrders(): Promise<Order[]> {
  await new Promise((res) => setTimeout(res, 50));
  return getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
}

/**
 * Get single order by ID
 * // TODO: Replace with fetch(`${FASTAPI_URL}/api/orders/{id}`)
 */
export async function getOrder(id: string): Promise<Order | null> {
  const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Create a new customer order
 * // TODO: Replace with POST `${FASTAPI_URL}/api/orders`
 */
export async function createOrder(orderData: Omit<Order, 'createdAt' | 'updatedAt'>): Promise<Order> {
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...orderData,
    createdAt: now,
    updatedAt: now,
  };
  const current = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  const updated = [newOrder, ...current];
  setStoredData(ORDERS_STORAGE_KEY, updated);
  return newOrder;
}

/**
 * Update an order's status
 * // TODO: Replace with PATCH `${FASTAPI_URL}/api/orders/{id}/status`
 */
export async function updateOrderStatus(id: string, status: OrderStatusType): Promise<Order | null> {
  const current = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  let updatedOrder: Order | null = null;
  const updated = current.map((order) => {
    if (order.id === id) {
      updatedOrder = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      };
      return updatedOrder;
    }
    return order;
  });
  setStoredData(ORDERS_STORAGE_KEY, updated);
  return updatedOrder;
}
