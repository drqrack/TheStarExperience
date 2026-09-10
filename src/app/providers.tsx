'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <CartProvider>{children}</CartProvider>
    </OrderProvider>
  );
}
