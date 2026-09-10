'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QrCode, Music, Calendar, MapPin, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function WelcomeContent() {
  const searchParams = useSearchParams();
  const { tableNumber, setTableNumber } = useCart();

  const tableParam = searchParams.get('table');

  useEffect(() => {
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [tableParam, setTableNumber]);

  const activeTable = tableParam || tableNumber || '12';

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <img src="/assets/IMG_0499.JPG.jpeg" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Nightlife Ambient Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-star-gold/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-amber-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#202020] bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center text-star-gold font-bold">
            <img src="/assets/republic_logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-white">
            THE REPUBLIC BAR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-[11px] text-zinc-400 hover:text-star-gold font-semibold transition-colors flex items-center gap-1 bg-[#1A1A1A] border border-[#2B2B2B] px-3 py-1.5 rounded-lg"
          >
            <Shield className="w-3 h-3 text-star-gold" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </header>

      {/* Hero Body */}
      <div className="relative z-10 max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Table Detected Card */}
        <div className="mb-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141414] border border-star-gold/40 gold-glow-sm shadow-xl">
            <QrCode className="w-4 h-4 text-star-gold" />
            <span className="text-xs text-star-muted uppercase tracking-wider font-semibold">
              QR DETECTED:
            </span>
            <span className="text-sm font-black text-star-gold font-mono tracking-wider">
              TABLE {activeTable}
            </span>
          </div>
        </div>

        {/* Artist & Event Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-star-gold/15 text-star-gold border border-star-gold/30">
            <Music className="w-3.5 h-3.5" /> Kwesi Dain
          </span>
          <span className="text-xs text-zinc-400 font-medium">presents</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase leading-none drop-shadow-lg">
          THE STAR <br />
          <span className="text-star-gold">EXPERIENCE</span>
        </h1>

        {/* Event Details Grid */}
        <div className="mt-5 mb-8 flex flex-col items-center gap-2 text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-star-gold" />
            <span className="font-semibold text-white">Wednesday, 3rd December</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin className="w-4 h-4 text-star-gold" />
            <span>The Republic Bar and Grill • Osu, Accra, Ghana</span>
          </div>
        </div>

        {/* Step highlights */}
        <div className="w-full bg-[#121212] border border-[#242424] rounded-2xl p-4 mb-8 shadow-inner">
          <p className="text-xs font-bold tracking-widest text-star-gold uppercase mb-3">
            Scan • Order • Pay • Enjoy
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-zinc-400">
            <div className="flex flex-col items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-star-gold flex items-center justify-center font-bold">
                1
              </span>
              <span>Table {activeTable}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-star-gold flex items-center justify-center font-bold">
                2
              </span>
              <span>Food & Drinks</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-star-gold flex items-center justify-center font-bold">
                3
              </span>
              <span>MoMo / Card</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-star-gold flex items-center justify-center font-bold">
                4
              </span>
              <span>Table Delivery</span>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="w-full space-y-3">
          <Link
            href={`/order?table=${activeTable}`}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-star-gold hover:bg-star-gold-hover text-star-black font-black tracking-wide text-base uppercase gold-glow-lg transition-all active:scale-[0.98] shadow-2xl"
          >
            <span>ORDER FROM YOUR TABLE</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <p className="text-[11px] text-star-muted font-medium">
            Direct table service • No account creation needed
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-[#1C1C1C] text-center text-xs text-zinc-500 bg-black/60">
        <p>© 2026 The Star Experience • The Republic Bar & Grill, Osu, Accra</p>
      </footer>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-star-gold font-bold">Loading Star Experience...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}
