'use client';

import React from 'react';
import { Order, OrderStatusType } from '@/types';
import { OrderCard } from './OrderCard';
import { Bell, Flame, PartyPopper, CheckCircle2 } from 'lucide-react';

interface OrderBoardProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatusType) => void;
}

interface ColumnConfig {
  id: OrderStatusType;
  title: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
}

export function OrderBoard({ orders, onStatusChange }: OrderBoardProps) {
  const columns: ColumnConfig[] = [
    {
      id: 'received',
      title: 'NEW ORDERS',
      icon: <Bell className="w-4 h-4 text-star-gold" />,
      badgeBg: 'bg-star-gold/15 border border-star-gold/30',
      badgeText: 'text-star-gold',
    },
    {
      id: 'preparing',
      title: 'PREPARING',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      badgeBg: 'bg-amber-500/15 border border-amber-500/30',
      badgeText: 'text-amber-400',
    },
    {
      id: 'ready',
      title: 'READY FOR TABLE',
      icon: <PartyPopper className="w-4 h-4 text-green-400" />,
      badgeBg: 'bg-green-500/15 border border-green-500/30',
      badgeText: 'text-green-400',
    },
    {
      id: 'completed',
      title: 'COMPLETED',
      icon: <CheckCircle2 className="w-4 h-4 text-zinc-400" />,
      badgeBg: 'bg-zinc-800 border border-zinc-700',
      badgeText: 'text-zinc-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {columns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-[#121212] border border-[#242424] rounded-2xl flex flex-col min-h-[500px] shadow-lg"
          >
            {/* Column Header */}
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="text-xs font-black tracking-wider text-white uppercase">
                  {col.title}
                </h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText}`}
              >
                {colOrders.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {colOrders.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#262626] rounded-xl">
                  <p className="text-xs text-star-muted font-medium">No orders in this state</p>
                </div>
              ) : (
                colOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
