'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { QuantityControl } from './QuantityControl';
import { TableBadge } from './TableBadge';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalCount,
    tableNumber,
    customerInfo,
    orderNotes,
    setOrderNotes,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleProceed = () => {
    setIsDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#141414] border-t sm:border border-[#2A2A2A] sm:rounded-3xl rounded-t-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-star-gold/15 border border-star-gold/30 flex items-center justify-center text-star-gold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">YOUR ORDER</h3>
                <TableBadge tableNumber={tableNumber} size="sm" />
              </div>
              <p className="text-xs text-star-muted">
                {customerInfo.name ? `Guest: ${customerInfo.name}` : 'The Republic Bar & Grill'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-star-red hover:text-red-400 p-2 rounded-lg hover:bg-star-red/10 transition-colors"
                title="Clear entire cart"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="text-star-muted hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-[#222222]">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#202020] text-star-muted flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-white font-bold text-sm">Your tray is empty</p>
              <p className="text-xs text-star-muted mt-1">
                Add food, cold beers or signature cocktails from the menu.
              </p>
            </div>
          ) : (
            items.map(({ item, quantity }) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-star-gold">
                      {formatCurrency(item.price * quantity)}
                    </span>
                    <span className="text-[11px] text-star-muted">
                      ({formatCurrency(item.price)} each)
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <QuantityControl
                    quantity={quantity}
                    onIncrease={() => updateQuantity(item.id, quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, quantity - 1)}
                    onRemove={() => removeItem(item.id)}
                    size="sm"
                  />
                </div>
              </div>
            ))
          )}

          {/* Kitchen / Bar notes input */}
          {items.length > 0 && (
            <div className="pt-4 mt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-star-muted flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-star-gold" />
                Notes for the Bar / Kitchen
              </label>
              <input
                type="text"
                placeholder="e.g. Extra spicy shito, no ice in cocktails, bottle opener..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#181818] border border-[#2B2B2B] text-xs text-white placeholder-star-muted/60 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-star-gold"
              />
            </div>
          )}
        </div>

        {/* Footer with subtotal and CTA */}
        {items.length > 0 && (
          <div className="p-5 bg-[#101010] border-t border-[#222222] shrink-0 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-star-muted font-medium">Subtotal ({totalCount} items)</span>
              <span className="text-white font-bold font-mono">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-star-muted pb-1">
              <span>Table Service Charge</span>
              <span className="text-star-green font-semibold">FREE (At Table)</span>
            </div>

            <div className="flex items-center justify-between text-base pt-2 border-t border-[#202020]">
              <span className="text-white font-extrabold uppercase tracking-wide">Total</span>
              <span className="text-xl font-black text-star-gold font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <Button
              type="button"
              variant="gold"
              size="lg"
              onClick={handleProceed}
              className="w-full text-sm font-black tracking-wide uppercase mt-2"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
