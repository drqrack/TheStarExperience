'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, CustomerInfo, MenuItem } from '@/types';

interface CartContextType {
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  totalCount: number;
  subtotal: number;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_CART_KEY = 'star_experience_cart_items';
const STORAGE_CUSTOMER_KEY = 'star_experience_customer_info';
const STORAGE_TABLE_KEY = 'star_experience_table_number';
const STORAGE_NOTES_KEY = 'star_experience_order_notes';

function getInitialStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getInitialString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw || fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [tableNumber, setTableNumberState] = useState<string>(() =>
    getInitialString(STORAGE_TABLE_KEY, '12')
  );

  const [customerInfo, setCustomerInfoState] = useState<CustomerInfo>(() =>
    getInitialStorage<CustomerInfo>(STORAGE_CUSTOMER_KEY, {
      name: '',
      phone: '',
      tableNumber: '12',
    })
  );

  const [items, setItems] = useState<CartItem[]>(() =>
    getInitialStorage<CartItem[]>(STORAGE_CART_KEY, [])
  );

  const [orderNotes, setOrderNotesState] = useState<string>(() =>
    getInitialString(STORAGE_NOTES_KEY, '')
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const setTableNumber = (table: string) => {
    setTableNumberState(table);
    setCustomerInfoState((prev) => ({ ...prev, tableNumber: table }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_TABLE_KEY, table);
    }
  };

  const setCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfoState(info);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(info));
      if (info.tableNumber) {
        localStorage.setItem(STORAGE_TABLE_KEY, info.tableNumber.toString());
      }
    }
  };

  const setOrderNotes = (notes: string) => {
    setOrderNotesState(notes);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_NOTES_KEY, notes);
    }
  };

  const saveCartItems = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(newItems));
    }
  };

  const addItem = (item: MenuItem, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
      } else {
        updated = [...prev, { item, quantity }];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((ci) => ci.item.id !== itemId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity } : ci
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearCart = () => {
    saveCartItems([]);
    setOrderNotes('');
  };

  const getItemQuantity = (itemId: string): number => {
    const found = items.find((ci) => ci.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        customerInfo,
        setCustomerInfo,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalCount,
        subtotal,
        orderNotes,
        setOrderNotes,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
