'use client';

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  min?: number;
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  size = 'md',
  min = 0,
}: QuantityControlProps) {
  const sizeStyles = {
    sm: {
      button: 'w-7 h-7 text-xs',
      text: 'text-xs w-6',
      icon: 'w-3 h-3',
      container: 'p-0.5 gap-1',
    },
    md: {
      button: 'w-8 h-8 text-sm',
      text: 'text-sm w-8',
      icon: 'w-3.5 h-3.5',
      container: 'p-1 gap-1.5',
    },
    lg: {
      button: 'w-10 h-10 text-base',
      text: 'text-base w-10',
      icon: 'w-4 h-4',
      container: 'p-1.5 gap-2',
    },
  };

  const isAtMin = quantity <= min;
  const showTrash = isAtMin && onRemove;

  return (
    <div
      className={`inline-flex items-center bg-[#1E1E1E] border border-[#333333] rounded-xl select-none ${sizeStyles[size].container}`}
    >
      <button
        type="button"
        onClick={showTrash ? onRemove : onDecrease}
        className={`${sizeStyles[size].button} flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-[#2A2A2A] active:scale-90 transition-all cursor-pointer`}
        aria-label={showTrash ? 'Remove item' : 'Decrease quantity'}
      >
        {showTrash ? (
          <Trash2 className={`${sizeStyles[size].icon} text-star-red`} />
        ) : (
          <Minus className={sizeStyles[size].icon} />
        )}
      </button>

      <span
        className={`${sizeStyles[size].text} font-bold text-center text-white font-mono`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={`${sizeStyles[size].button} flex items-center justify-center rounded-lg bg-star-gold text-star-black hover:bg-star-gold-hover active:scale-90 transition-all cursor-pointer font-bold`}
        aria-label="Increase quantity"
      >
        <Plus className={sizeStyles[size].icon} />
      </button>
    </div>
  );
}
