'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useOrders } from '@/context/OrderContext';
import { Order, OrderStatusType } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { TableBadge } from '@/components/customer/TableBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Printer, User, Phone, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '1042';

  const { orders, changeOrderStatus } = useOrders();

  const order: Order = orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase()) || {
    id: orderId,
    tableNumber: 12,
    customerName: 'Kofi Appiah',
    phone: '0244123456',
    items: [
      { id: 'beer-001', name: 'Club Beer (Large)', price: 25, quantity: 2 },
      { id: 'food-001', name: 'Ghanaian Jollof Rice', price: 50, quantity: 1 },
      { id: 'food-004', name: 'Crispy Peppered Chicken Wings', price: 50, quantity: 1 },
    ],
    subtotal: 150,
    total: 150,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    momoNetwork: 'mtn',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Extra spicy shito on the side please',
  };

  const handleUpdateStatus = async (newStatus: OrderStatusType) => {
    await changeOrderStatus(order.id, newStatus);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <AdminHeader />

      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-star-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders Board</span>
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Bar Slip
            </Button>
          </div>

          {/* Printable / Receipt Style Ticket */}
          <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242424]">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black font-mono tracking-tight text-white">
                    ORDER #{order.id}
                  </h1>
                  <Badge
                    variant={
                      order.status === 'completed'
                        ? 'green'
                        : order.status === 'ready'
                        ? 'blue'
                        : 'gold'
                    }
                    size="md"
                    pulse={order.status === 'received'}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-star-muted mt-1 font-mono">
                  Placed at {formatDateTime(order.createdAt)} • The Republic Bar & Grill
                </p>
              </div>

              <div className="flex items-center gap-3">
                <TableBadge tableNumber={order.tableNumber} size="lg" />
              </div>
            </div>

            {/* Customer & Payment Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#181818] border border-[#262626] text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-star-muted block">
                  Customer Information
                </span>
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <User className="w-4 h-4 text-star-gold" />
                  <span>{order.customerName}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 font-mono text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-star-gold" />
                    <span>{order.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-[#282828] sm:pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-star-muted block">
                  Payment Status
                </span>
                <div className="flex items-center gap-2 font-bold text-star-green text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="uppercase font-mono">{order.paymentStatus}</span>
                  <span className="text-xs text-zinc-400 font-normal">
                    via {order.paymentMethod.toUpperCase()}
                    {order.momoNetwork ? ` (${order.momoNetwork.toUpperCase()})` : ''}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Verified for The Star Experience event
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-star-muted">
                Items To Prepare ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              <div className="border border-[#222222] rounded-2xl overflow-hidden divide-y divide-[#202020]">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex items-center justify-between hover:bg-[#181818] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-star-gold/15 text-star-gold font-mono font-black flex items-center justify-center text-sm">
                        {item.quantity}×
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        <span className="text-xs text-star-muted font-mono">
                          {formatCurrency(item.price)} each
                        </span>
                      </div>
                    </div>

                    <span className="font-mono font-black text-sm text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.notes && (
              <div className="p-4 bg-amber-500/10 border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300">
                <MessageSquare className="w-4 h-4 text-star-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-star-gold uppercase tracking-wider font-bold">
                    Special Customer Note:
                  </strong>
                  <span>&ldquo;{order.notes}&rdquo;</span>
                </div>
              </div>
            )}

            {/* Total and Status Actions */}
            <div className="pt-6 border-t border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-star-muted uppercase tracking-wider block font-semibold">
                  Total Paid
                </span>
                <span className="text-3xl font-black font-mono text-star-gold tracking-tight">
                  {formatCurrency(order.total)}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={order.status === 'received' ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => handleUpdateStatus('received')}
                >
                  New
                </Button>
                <Button
                  variant={order.status === 'preparing' ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => handleUpdateStatus('preparing')}
                >
                  Preparing
                </Button>
                <Button
                  variant={order.status === 'ready' ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => handleUpdateStatus('ready')}
                >
                  Mark Ready
                </Button>
                <Button
                  variant={order.status === 'completed' ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => handleUpdateStatus('completed')}
                >
                  Completed
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
