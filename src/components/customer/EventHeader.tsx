'use client';

import React from 'react';
import { Music, MapPin, Calendar } from 'lucide-react';
import { TableBadge } from './TableBadge';
import { useCart } from '@/context/CartContext';

interface EventHeaderProps {
  compact?: boolean;
}

export function EventHeader({ compact = false }: EventHeaderProps) {
  const { tableNumber, customerInfo } = useCart();

  if (compact) {
    return (
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#202020] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-star-gold/15 border border-star-gold/40 flex items-center justify-center text-star-gold">
              <img src="/assets/republic_logo.png" alt="Logo" className="w-4 h-4 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest text-white uppercase">
                  THE STAR EXPERIENCE
                </span>
                <span className="text-[10px] text-star-gold font-bold px-1.5 py-0.2 rounded bg-star-gold/10">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-star-muted">Kwesi Dain • The Republic Bar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TableBadge tableNumber={tableNumber} size="sm" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#161616] via-[#0E0E0E] to-[#0A0A0A] border-b border-[#222222] pt-7 pb-6 px-4">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-star-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Top Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-star-gold/15 text-star-gold border border-star-gold/30 px-3 py-1 rounded-full">
            <Music className="w-3 h-3" /> Kwesi Dain Live
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-star-muted bg-[#181818] border border-[#282828] px-3 py-1 rounded-full">
            <Calendar className="w-3 h-3 text-star-gold" /> 3rd December
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-star-muted bg-[#181818] border border-[#282828] px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-star-gold" /> The Republic Bar, Osu
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
          THE STAR <span className="text-star-gold">EXPERIENCE</span>
        </h1>
        <p className="text-sm text-star-muted mt-1 tracking-wide font-medium">
          Order food and drinks directly from your table
        </p>

        {/* Table Badge Callout */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <TableBadge tableNumber={tableNumber} size="md" />
          {customerInfo.name && (
            <span className="text-xs bg-[#1A1A1A] border border-[#2D2D2D] text-zinc-300 px-3 py-1.5 rounded-xl font-medium">
              Guest: <strong className="text-white">{customerInfo.name}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
