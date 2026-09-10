'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export function CartButton() {
  const { totalCount, subtotal, setIsDrawerOpen } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-star-gold hover:bg-star-gold-hover text-star-black font-extrabold gold-glow-lg transition-all duration-200 active:scale-[0.98] shadow-2xl cursor-pointer"
        >
          {/* Left badge & count */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-star-black text-star-gold">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-star-gold text-star-black border-2 border-star-black text-[10px] font-black flex items-center justify-center font-mono">
                {totalCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs uppercase tracking-wider font-extrabold block text-star-black/75">
                VIEW ORDER
              </span>
              <span className="text-sm font-black tracking-tight font-mono">
                {totalCount} {totalCount === 1 ? 'ITEM' : 'ITEMS'}
              </span>
            </div>
          </div>

          {/* Right total and arrow */}
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black font-mono tracking-tight text-star-black">
              {formatCurrency(subtotal)}
            </span>
            <div className="w-8 h-8 rounded-full bg-star-black/15 flex items-center justify-center text-star-black">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
