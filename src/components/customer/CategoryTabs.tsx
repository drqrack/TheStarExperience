'use client';

import React from 'react';
import { ItemCategory } from '@/types';
import { Utensils, Beer, Wine, Coffee, Flame , Sparkles} from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: ItemCategory;
  onSelectCategory: (cat: ItemCategory) => void;
  counts?: Record<ItemCategory, number>;
}

interface CategoryOption {
  id: ItemCategory;
  label: string;
  icon: React.ReactNode;
}

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  counts,
}: CategoryTabsProps) {
  const categories: CategoryOption[] = [
    { id: 'all', label: 'All Items', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'drinks', label: 'All Drinks', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'cocktails', label: 'Cocktails', icon: <Wine className="w-3.5 h-3.5" /> },
    { id: 'beer', label: 'Beer', icon: <Beer className="w-3.5 h-3.5" /> },
    { id: 'soft-drinks', label: 'Soft Drinks', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 -mx-4 flex items-center gap-2 select-none scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = counts?.[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer active:scale-95 ${
              isSelected
                ? 'bg-star-gold text-star-black font-bold gold-glow-sm shadow-md'
                : 'bg-[#181818] border border-[#2A2A2A] text-zinc-300 hover:text-white hover:border-[#383838] hover:bg-[#202020]'
            }`}
          >
            <span className={isSelected ? 'text-star-black' : 'text-star-gold'}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
