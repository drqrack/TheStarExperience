'use client';

import React from 'react';
import { MenuItem as MenuItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { QuantityControl } from './QuantityControl';
import { Badge } from '@/components/ui/Badge';
import { Plus, Clock, Utensils, Wine, Beer, Coffee , Sparkles} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

// Generates an attractive, failure-proof nightlife placeholder icon based on category
function getItemVisual(item: MenuItemType) {
  const isFood = item.category === 'food';
  const isCocktail = item.category === 'cocktails';
  const isBeer = item.category === 'beer';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#222222] via-[#181818] to-[#121212]">
      {/* Decorative gradient glow */}
      <div
        className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-xl ${
          isCocktail
            ? 'bg-amber-500/20'
            : isBeer
            ? 'bg-yellow-500/20'
            : 'bg-orange-500/20'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center p-3">
        <div className="w-12 h-12 rounded-2xl bg-[#262626] border border-white/10 flex items-center justify-center text-star-gold shadow-lg mb-1.5 group-hover:scale-110 transition-transform duration-200">
          {isCocktail && <Wine className="w-6 h-6 text-star-gold" />}
          {isBeer && <Beer className="w-6 h-6 text-amber-400" />}
          {isFood && <Utensils className="w-6 h-6 text-orange-400" />}
          {!isCocktail && !isBeer && !isFood && <Coffee className="w-6 h-6 text-star-gold" />}
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
          {item.category}
        </span>
      </div>
    </div>
  );
}

export function MenuItem({ item }: MenuItemProps) {
  const { addItem, updateQuantity, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleAdd = () => {
    addItem(item, 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <div
      className={`group relative bg-[#151515] border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
        quantity > 0
          ? 'border-star-gold/50 shadow-lg shadow-star-gold/10'
          : 'border-[#262626] hover:border-[#383838]'
      } ${!item.available ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      {/* Top Banner Image Placeholder */}
      <div className="relative h-36 w-full border-b border-[#242424] overflow-hidden">
        {getItemVisual(item)}

        {/* Badge tag if any */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-star-gold text-star-black shadow-md">
              <Sparkles className="w-3 h-3" /> {item.badge}
            </span>
          </div>
        )}

        {/* Prep Time Tag */}
        {item.prepTimeMinutes && (
          <div className="absolute top-2.5 right-2.5 z-20">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-star-gold" /> {item.prepTimeMinutes}m
            </span>
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <Badge variant="red">Sold Out Tonight</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-star-gold transition-colors leading-snug">
              {item.name}
            </h3>
          </div>
          <p className="text-xs text-star-muted mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-star-muted uppercase tracking-wider block font-semibold">
              Price
            </span>
            <span className="text-lg font-black text-star-gold tracking-tight font-mono">
              {formatCurrency(item.price)}
            </span>
          </div>

          <div>
            {quantity === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-star-gold text-white hover:text-star-black border border-[#333333] hover:border-star-gold text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-star-gold group-hover:text-star-black" />
                <span>ADD</span>
              </button>
            ) : (
              <QuantityControl
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
