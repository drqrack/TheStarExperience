'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, QrCode, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { OrderSummary } from '@/components/customer/OrderSummary';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    tableNumber,
    customerInfo,
    subtotal,
    orderNotes,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#2B2B2B] flex items-center justify-center text-star-muted mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Tray is Empty</h2>
        <p className="text-sm text-star-muted mt-1 max-w-sm">
          Please add some food or drinks from the menu before checking out.
        </p>
        <Link
          href={`/order?table=${tableNumber || '12'}`}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-star-gold text-star-black font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  const summaryItems = items.map((ci) => ({
    id: ci.item.id,
    name: ci.item.name,
    quantity: ci.quantity,
    price: ci.item.price,
    notes: ci.notes,
  }));

  const handleContinue = () => {
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#222222] px-4 py-3.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href={`/order?table=${tableNumber}`}
            className="flex items-center gap-1.5 text-xs text-star-muted hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>

          <span className="text-xs font-black tracking-widest uppercase text-star-gold">
            CHECKOUT
          </span>

          <div className="text-xs font-mono font-bold text-zinc-400">
            Table {tableNumber}
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="max-w-lg mx-auto w-full p-4 sm:p-6 flex-1 space-y-5">
        {/* Table Confirmation Callout */}
        <div className="flex items-center justify-between bg-[#141414] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-star-gold/15 border border-star-gold/40 flex items-center justify-center text-star-gold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-star-gold tracking-wider block">
                DELIVERY DESTINATION
              </span>
              <h4 className="text-sm font-black text-white font-mono">
                TABLE {tableNumber}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-star-green font-semibold block">
              Direct to Table
            </span>
            <span className="text-[10px] text-star-muted">Republic Bar & Grill</span>
          </div>
        </div>

        {/* Order Summary Component */}
        <OrderSummary
          tableNumber={tableNumber}
          customerName={customerInfo.name}
          phone={customerInfo.phone}
          items={summaryItems}
          subtotal={subtotal}
          total={subtotal}
          notes={orderNotes}
        />

        {/* Security & Service Note */}
        <div className="flex items-center gap-2.5 p-3.5 bg-[#121212] border border-[#222222] rounded-xl text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-star-gold shrink-0" />
          <span>
            Orders are sent straight to the bar. Pay securely on the next step to confirm your order.
          </span>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 space-y-3">
          <Button
            type="button"
            variant="gold"
            size="lg"
            onClick={handleContinue}
            className="w-full text-base font-black tracking-wider uppercase shadow-xl"
            rightIcon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
          >
            CONTINUE TO PAYMENT
          </Button>

          <Link
            href={`/order?table=${tableNumber}`}
            className="block text-center text-xs text-star-muted hover:text-white font-medium py-2 transition-colors"
          >
            ← Back to Menu to add more items
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-zinc-500 border-t border-[#1C1C1C]">
        The Star Experience by Kwesi Dain • 3rd December 2026
      </footer>
    </div>
  );
}
