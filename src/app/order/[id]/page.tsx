'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useOrders } from '@/context/OrderContext';
import { Order, OrderStatusType } from '@/types';
import { OrderStatus } from '@/components/customer/OrderStatus';
import { OrderSummary } from '@/components/customer/OrderSummary';
import { TableBadge } from '@/components/customer/TableBadge';
import { ArrowLeft, Utensils , Sparkles} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '1042';

  const { orders, changeOrderStatus } = useOrders();

  // Derived order from shared orders context, with authentic fallback
  const order: Order = orders.find(
    (o) => o.id.toLowerCase() === orderId.toLowerCase()
  ) || {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Extra spicy shito please',
  };

  // TODO: Connect order status to FastAPI WebSocket when backend is implemented.
  // Example:
  // useEffect(() => {
  //   const ws = new WebSocket(`${WS_BASE_URL}/ws/orders/${orderId}`);
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.event === 'order_status_updated') {
  //       changeOrderStatus(data.order.id, data.order.status);
  //     }
  //   };
  //   return () => ws.close();
  // }, [orderId, changeOrderStatus]);

  const handleSimulateStatus = async (newStatus: OrderStatusType) => {
    await changeOrderStatus(order.id, newStatus);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#222222] px-4 py-3.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href={`/order?table=${order.tableNumber}`}
            className="flex items-center gap-1.5 text-xs text-star-muted hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu</span>
          </Link>

          <span className="text-xs font-black tracking-widest uppercase text-star-gold">
            LIVE ORDER TRACKING
          </span>

          <TableBadge tableNumber={order.tableNumber} size="sm" />
        </div>
      </header>

      {/* Main Tracking Content */}
      <main className="max-w-lg mx-auto w-full p-4 sm:p-6 flex-1 space-y-6">
        {/* Customer & Order Hero Identification */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-star-gold/15 text-star-gold border border-star-gold/30 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> The Star Experience • Kwesi Dain
          </div>

          <h2 className="text-2xl font-black uppercase text-white tracking-wide">
            ORDER #{order.id}
          </h2>

          <div className="mt-2 flex items-center justify-center gap-2">
            <TableBadge tableNumber={order.tableNumber} size="md" />
            <span className="text-xs text-zinc-300 font-medium bg-[#1E1E1E] px-3 py-1.5 rounded-xl border border-[#2D2D2D]">
              {order.customerName}
            </span>
          </div>

          <p className="text-xs text-star-muted mt-3">
            {order.status === 'received' && 'Your order has been received by the bar.'}
            {order.status === 'preparing' && 'Your order is currently being prepared.'}
            {order.status === 'ready' && 'Your order is ready! Enjoy the show.'}
            {order.status === 'completed' && 'Your order has been completed.'}
          </p>
        </div>

        {/* 5-Step Order Progress Tracker */}
        <OrderStatus
          status={order.status}
          onSimulateStatus={handleSimulateStatus}
          allowSimulate={true}
        />

        {/* Order Summary breakdown */}
        <OrderSummary
          orderId={order.id}
          tableNumber={order.tableNumber}
          customerName={order.customerName}
          phone={order.phone}
          items={order.items}
          subtotal={order.subtotal}
          total={order.total}
          notes={order.notes}
        />

        {/* Quick order more food / drinks */}
        <div className="pt-2">
          <Link
            href={`/order?table=${order.tableNumber}`}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1E1E1E] hover:bg-[#282828] text-white border border-[#333333] text-sm font-bold transition-all text-center"
          >
            <Utensils className="w-4 h-4 text-star-gold" />
            <span>Order More Drinks or Food for Table {order.tableNumber}</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-zinc-500 border-t border-[#1C1C1C]">
        The Republic Bar & Grill • Osu, Accra
      </footer>
    </div>
  );
}
