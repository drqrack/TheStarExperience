import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { TableBadge } from './TableBadge';
import { User, Phone, FileText } from 'lucide-react';

interface SummaryItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderSummaryProps {
  tableNumber: string | number;
  customerName?: string;
  phone?: string;
  items: SummaryItem[];
  subtotal: number;
  total: number;
  orderId?: string;
  notes?: string;
}

export function OrderSummary({
  tableNumber,
  customerName,
  phone,
  items,
  subtotal,
  total,
  orderId,
  notes,
}: OrderSummaryProps) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
      {/* Header Info */}
      <div className="p-5 border-b border-[#222222] bg-gradient-to-r from-[#171717] to-[#121212]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-star-gold block mb-1">
              THE REPUBLIC BAR & GRILL
            </span>
            <h3 className="text-lg font-extrabold text-white">ORDER SUMMARY</h3>
            {orderId && (
              <span className="text-xs text-star-muted font-mono">Order #{orderId}</span>
            )}
          </div>
          <TableBadge tableNumber={tableNumber} size="md" />
        </div>

        {(customerName || phone) && (
          <div className="mt-4 pt-3 border-t border-[#262626] flex flex-wrap items-center gap-4 text-xs text-zinc-300">
            {customerName && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-star-gold" />
                <span className="font-medium text-white">{customerName}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-star-gold" />
                <span className="font-mono text-zinc-300">{phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item List */}
      <div className="p-5 divide-y divide-[#202020]">
        <div className="pb-3 text-xs font-semibold uppercase tracking-wider text-star-muted">
          Items Ordered ({items.reduce((s, i) => s + i.quantity, 0)})
        </div>

        {items.map((item, idx) => (
          <div key={item.id || idx} className="py-3 flex items-center justify-between text-sm">
            <div className="flex items-start gap-2.5">
              <span className="font-bold font-mono text-star-gold text-sm w-6">
                {item.quantity}×
              </span>
              <div>
                <span className="text-white font-medium">{item.name}</span>
                {item.notes && (
                  <p className="text-[11px] text-star-muted italic mt-0.5">{item.notes}</p>
                )}
              </div>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {notes && (
        <div className="px-5 py-3 bg-[#181818] border-t border-[#222222] flex items-start gap-2 text-xs text-star-muted">
          <FileText className="w-4 h-4 text-star-gold shrink-0 mt-0.5" />
          <span>Note: &ldquo;{notes}&rdquo;</span>
        </div>
      )}

      {/* Totals */}
      <div className="p-5 bg-[#0F0F0F] border-t border-[#222222] space-y-2">
        <div className="flex items-center justify-between text-xs text-star-muted">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-zinc-300">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-star-muted">
          <span>Table Delivery / Service</span>
          <span className="text-star-green font-semibold">GH₵0 (Free at Table)</span>
        </div>
        <div className="flex items-center justify-between text-base pt-2 border-t border-[#222222]">
          <span className="font-extrabold text-white uppercase tracking-wider">Total</span>
          <span className="font-black text-xl text-star-gold font-mono">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
