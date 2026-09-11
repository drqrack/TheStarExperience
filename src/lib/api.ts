/**
 * API Abstraction Layer for The Star Experience
 *
 * This module provides a centralized API client for communicating with the FastAPI backend.
 * The backend URL is configured via NEXT_PUBLIC_API_URL environment variable.
 *
 * Connected endpoints:
 * - GET  /api/menu             -> Fetch active menu (from FastAPI)
 * - GET  /api/menu/categories  -> Fetch menu categories (from FastAPI)
 * - GET  /api/tables/{id}      -> Fetch table info (from FastAPI)
 *
 * Still using localStorage (to be connected later):
 * - POST   /api/orders                 -> Create new order (Customer)
 * - GET    /api/orders                 -> List orders (Admin)
 * - GET    /api/orders/{id}            -> Fetch specific order tracking details
 * - PATCH  /api/orders/{id}/status     -> Update order status (Admin)
 * - POST   /api/payments/initialize    -> Initialize Paystack / Hubtel transaction
 * - POST   /api/payments/webhook       -> Webhook for payment verification
 */

import {
  MenuItem,
  Order,
  OrderStatusType,
  ApiMenuItemResponse,
  ApiMenuCategoryResponse,
  ApiTableResponse,
} from '@/types';
import { INITIAL_MENU } from '@/data/menu';
import { INITIAL_ORDERS } from '@/data/orders';

// ─── Centralized API Configuration ──────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/docs';

/**
 * Centralized fetch wrapper for all FastAPI calls.
 * Adds consistent error handling, timeouts, and JSON parsing.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new ApiError(
        `API error ${response.status}: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out. The server may be unavailable.', 0);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error — could not reach the server.',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Custom error class for API failures, includes HTTP status code.
 */
export class ApiError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string = '') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ─── Badge & prep time defaults (not stored in backend yet) ──────
// Maps menu item names to their display badges and prep times from the original mock data.
const ITEM_METADATA: Record<string, { badge?: string; prepTimeMinutes?: number }> = {};
INITIAL_MENU.forEach((item) => {
  ITEM_METADATA[item.name] = {
    badge: item.badge,
    prepTimeMinutes: item.prepTimeMinutes,
  };
});

// ─── Category ID → name mapping cache ────────────────────────────
let categoryMapCache: Record<number, string> | null = null;

async function getCategoryMap(): Promise<Record<number, string>> {
  if (categoryMapCache) return categoryMapCache;

  const categories = await apiFetch<ApiMenuCategoryResponse[]>('/api/menu/categories');
  const map: Record<number, string> = {};
  for (const cat of categories) {
    map[cat.id] = cat.name;
  }
  categoryMapCache = map;
  return map;
}

/**
 * Convert backend MenuItemResponse → frontend MenuItem type
 */
function mapApiMenuItem(
  apiItem: ApiMenuItemResponse,
  categoryMap: Record<number, string>
): MenuItem {
  const categoryName = categoryMap[apiItem.category_id] || 'food';
  const meta = ITEM_METADATA[apiItem.name] || {};

  return {
    id: String(apiItem.id),
    name: apiItem.name,
    description: apiItem.description || '',
    price: apiItem.price,
    category: categoryName as MenuItem['category'],
    available: apiItem.is_available,
    badge: meta.badge,
    prepTimeMinutes: meta.prepTimeMinutes,
  };
}

// ─── Connected API Functions ─────────────────────────────────────

/**
 * Fetch all menu items from the FastAPI backend.
 * Maps backend schema to frontend MenuItem type.
 */
export async function getMenu(): Promise<MenuItem[]> {
  const [apiItems, categoryMap] = await Promise.all([
    apiFetch<ApiMenuItemResponse[]>('/api/menu'),
    getCategoryMap(),
  ]);

  return apiItems.map((item) => mapApiMenuItem(item, categoryMap));
}

/**
 * Fetch table information from the FastAPI backend.
 * Returns null if the table is not found (404).
 */
export async function getTable(tableId: string | number): Promise<ApiTableResponse | null> {
  try {
    return await apiFetch<ApiTableResponse>(`/api/tables/${tableId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ─── localStorage-based functions (to be connected to backend later) ─

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
 * Save or update a menu item
 * // TODO: Replace with POST/PUT `${API_BASE_URL}/api/menu`
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
 * // TODO: Replace with PATCH `${API_BASE_URL}/api/menu/{id}/availability`
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
 * // TODO: Replace with DELETE `${API_BASE_URL}/api/menu/{id}`
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
  const current = getStoredData<MenuItem[]>(MENU_STORAGE_KEY, INITIAL_MENU);
  const updated = current.filter((item) => item.id !== id);
  setStoredData(MENU_STORAGE_KEY, updated);
  return true;
}

/**
 * Fetch all orders (Bar Admin)
 * // TODO: Replace with fetch(`${API_BASE_URL}/api/orders`)
 */
export async function getOrders(): Promise<Order[]> {
  await new Promise((res) => setTimeout(res, 50));
  return getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
}

/**
 * Get single order by ID
 * // TODO: Replace with fetch(`${API_BASE_URL}/api/orders/{id}`)
 */
export async function getOrder(id: string): Promise<Order | null> {
  const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Create a new customer order
 * // TODO: Replace with POST `${API_BASE_URL}/api/orders`
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
 * // TODO: Replace with PATCH `${API_BASE_URL}/api/orders/{id}/status`
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
