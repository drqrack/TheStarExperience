'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventHeader } from '@/components/customer/EventHeader';
import { CustomerForm } from '@/components/customer/CustomerForm';
import { CategoryTabs } from '@/components/customer/CategoryTabs';
import { MenuGrid } from '@/components/customer/MenuGrid';
import { CartButton } from '@/components/customer/CartButton';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useCart } from '@/context/CartContext';
import { ItemCategory, MenuItem } from '@/types';
import { getMenu, getTable, ApiError as ApiErrorClass } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ApiError } from '@/components/ui/ApiError';
import { Search, UserCheck, Edit3 } from 'lucide-react';

function OrderPageContent() {
  const searchParams = useSearchParams();
  const { tableNumber, setTableNumber, customerInfo } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [isConnectionError, setIsConnectionError] = useState<boolean>(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [isValidatingTable, setIsValidatingTable] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCustomerFormModal, setShowCustomerFormModal] = useState<boolean>(false);

  const tableParam = searchParams.get('table');

  // Sync table from URL if provided
  useEffect(() => {
    if (tableParam && tableParam !== tableNumber) {
      setTableNumber(tableParam);
    }
  }, [tableParam, tableNumber, setTableNumber]);

  const activeTable = tableParam || tableNumber;

  // Validate table against backend
  useEffect(() => {
    if (!activeTable) return;

    let isCancelled = false;
    async function validateTable() {
      setIsValidatingTable(true);
      try {
        const table = await getTable(activeTable);
        if (!isCancelled) {
          if (!table) {
            setTableError(`Table ${activeTable} was not found. Please scan a valid QR code.`);
          } else {
            setTableError(null);
          }
        }
      } catch (err) {
        console.error('Table validation failed:', err);
      } finally {
        if (!isCancelled) {
          setIsValidatingTable(false);
        }
      }
    }
    validateTable();
    return () => {
      isCancelled = true;
    };
  }, [activeTable]);

  // Load menu items from backend
  const loadMenu = useCallback(async () => {
    setIsLoadingMenu(true);
    setMenuError(null);
    setIsConnectionError(false);
    try {
      const items = await getMenu();
      setMenuItems(items);
    } catch (err) {
      console.error('Failed to load menu:', err);
      if (err instanceof ApiErrorClass) {
        setIsConnectionError(err.status === 0);
        setMenuError(err.message);
      } else {
        setMenuError('An unexpected error occurred while loading the menu.');
      }
    } finally {
      setIsLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Determine if customer details are already provided
  const hasCustomerDetails = Boolean(customerInfo.name && customerInfo.phone);

  // If customer has not provided details yet, show the customer information form first
  if (!hasCustomerDetails && !showCustomerFormModal) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between p-4 py-8 relative">
        <div className="w-full max-w-md mx-auto my-auto">
          <CustomerForm
            hasTableParam={Boolean(tableParam || tableNumber)}
            onComplete={() => {
              // Customer details set in context, proceed to menu view
            }}
          />
        </div>
      </div>
    );
  }

  // Calculate counts per category
  const categoryCounts = menuItems.reduce((acc, item) => {
    acc['all'] = (acc['all'] || 0) + 1;
    acc[item.category] = (acc[item.category] || 0) + 1;
    if (item.category === 'beer' || item.category === 'cocktails' || item.category === 'soft-drinks') {
      acc['drinks'] = (acc['drinks'] || 0) + 1;
    }
    return acc;
  }, {} as Record<ItemCategory, number>);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col text-white pb-16">
      {/* Event Header */}
      <EventHeader />

      {/* Table Error Banner */}
      {tableError && (
        <div className="bg-red-900/20 border-b border-red-900/40 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-red-300">
            <span className="font-bold">⚠ Table Error:</span>
            <span>{tableError}</span>
          </div>
        </div>
      )}

      {/* Customer Bar & Quick Edit */}
      <div className="bg-[#121212] border-b border-[#222222] px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <UserCheck className="w-4 h-4 text-star-gold shrink-0" />
            <span>
              Ordering for <strong className="text-white">{customerInfo.name || 'Guest'}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomerFormModal(true)}
            className="flex items-center gap-1 text-star-gold hover:underline font-semibold cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-1">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-star-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Jollof, Club beer, cocktails, wings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-star-muted/60 focus:outline-none focus:border-star-gold transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-5">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Menu Content */}
        {isLoadingMenu ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Loading authentic menu..." />
          </div>
        ) : menuError ? (
          <ApiError
            message={menuError}
            onRetry={loadMenu}
            isConnectionError={isConnectionError}
          />
        ) : menuItems.length === 0 ? (
          <ApiError
            title="Menu Unavailable"
            message="The menu is currently empty. Please check back shortly or ask your server for assistance."
          />
        ) : (
          <MenuGrid
            items={menuItems}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Floating Mobile Cart Bar */}
      <CartButton />

      {/* Slide-up Cart Drawer */}
      <CartDrawer />

      {/* Edit Customer Info Modal */}
      {showCustomerFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md relative">
            <CustomerForm
              hasTableParam={Boolean(tableNumber)}
              onComplete={() => setShowCustomerFormModal(false)}
            />
            <button
              type="button"
              onClick={() => setShowCustomerFormModal(false)}
              className="absolute top-4 right-4 text-star-muted hover:text-white text-xs font-bold bg-[#222] px-2.5 py-1 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-star-gold font-bold">Loading Table Menu...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}
