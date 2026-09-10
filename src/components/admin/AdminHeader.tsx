'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, PlusCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/Button';

export function AdminHeader() {
  const { hasNewOrderAlert, dismissNewOrderAlert, simulateIncomingOrder } = useOrders();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-GH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#222222] px-4 sm:px-8 py-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Branding & Event */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-star-gold font-black">
            <img src="/assets/republic_logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                THE STAR EXPERIENCE
              </h1>
            </div>
            <p className="text-xs text-star-muted">
              The Republic Bar & Grill • Osu, Accra
            </p>
          </div>
        </div>

        {/* Action Controls & Clock */}
        <div className="flex flex-wrap items-center gap-3">
          {/* New order notification pill */}
          {hasNewOrderAlert && (
            <button
              type="button"
              onClick={dismissNewOrderAlert}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-star-gold text-star-black text-xs font-black animate-bounce gold-glow cursor-pointer"
            >
              <Bell className="w-4 h-4 fill-current animate-spin" />
              <span>🔔 NEW ORDER ARRIVED!</span>
            </button>
          )}

          {/* Quick Demo Simulator */}
          <Button
            variant="secondary"
            size="sm"
            onClick={simulateIncomingOrder}
            leftIcon={<PlusCircle className="w-3.5 h-3.5 text-star-gold" />}
            className="text-xs"
          >
            Simulate Order
          </Button>

          {/* Customer view shortcut */}
          <Link
            href="/order?table=12"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-[#2F2F2F] rounded-xl transition-colors font-medium"
          >
            <span>Customer View (Table 12)</span>
            <ExternalLink className="w-3 h-3 text-star-gold" />
          </Link>

          {/* Live Clock & Staff Badge */}
          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-[#262626]">
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-white block">
                {time || 'Accra Live'}
              </span>
              <span className="text-[10px] text-star-muted">GMT</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-star-green text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
