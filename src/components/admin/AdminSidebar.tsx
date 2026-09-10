'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, LogOut, ExternalLink, QrCode } from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Live Orders Board',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Menu Management',
      href: '/admin/menu',
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0F0F0F] border-r border-[#222222] flex flex-col justify-between shrink-0 p-4">
      <div className="space-y-6">
        <div className="px-3 pt-2 hidden md:block">
          <span className="text-[10px] uppercase font-bold tracking-widest text-star-muted block">
            PORTAL
          </span>
          <p className="text-sm font-extrabold text-white mt-0.5">Republic Bar Staff</p>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-star-gold text-star-black font-bold gold-glow-sm shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                <span className={isActive ? 'text-star-black' : 'text-star-gold'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:block pt-6 border-t border-[#222222] space-y-2">
        <Link
          href="/order?table=12"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
        >
          <span className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-star-gold" />
            <span>Open Table 12 QR</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </Link>

        <Link
          href="/admin/login"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-star-red hover:bg-star-red/10 transition-colors font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
