'use client';

import React from 'react';
import { MenuItem as MenuItemType, ItemCategory } from '@/types';
import { MenuItem } from './MenuItem';
import { Search } from 'lucide-react';

interface MenuGridProps {
  items: MenuItemType[];
  selectedCategory: ItemCategory;
  searchQuery?: string;
}

export function MenuGrid({
  items,
  selectedCategory,
  searchQuery = '',
}: MenuGridProps) {
  const filtered = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'drinks' &&
        (item.category === 'beer' ||
          item.category === 'cocktails' ||
          item.category === 'soft-drinks'));

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center bg-[#121212] border border-[#222] rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center text-star-muted mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="text-white font-bold text-base">No items found</h4>
        <p className="text-star-muted text-xs mt-1 max-w-xs">
          We couldn&apos;t find anything matching your search. Try another category or query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
      {filtered.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
