'use client';

import React, { useEffect } from 'react';
import { OrderStatusType } from '@/types';
import { Check, Clock, Flame, PartyPopper, CheckCircle2 , Sparkles} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderStatusProps {
  status: OrderStatusType;
  onSimulateStatus?: (newStatus: OrderStatusType) => void;
  allowSimulate?: boolean;
}

interface Step {
  id: string;
  label: string;
  statusMatch: OrderStatusType[];
  icon: React.ReactNode;
}

export function OrderStatus({
  status,
  onSimulateStatus,
  allowSimulate = true,
}: OrderStatusProps) {
  // Fire confetti celebration whenever status transitions to 'ready'
  useEffect(() => {
    if (status === 'ready') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F8D50E', '#FFFFFF', '#22C55E', '#FFA500'],
        });
      } catch (err) {
        console.debug('Confetti effect failed:', err);
      }
    }
  }, [status]);

  const steps: Step[] = [
    {
      id: 'step-received',
      label: 'Order Received',
      statusMatch: ['received', 'preparing', 'ready', 'completed'],
      icon: <Check className="w-4 h-4" />,
    },
    {
      id: 'step-payment',
      label: 'Payment Confirmed',
      statusMatch: ['received', 'preparing', 'ready', 'completed'],
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: 'step-preparing',
      label: 'Preparing at Bar',
      statusMatch: ['preparing', 'ready', 'completed'],
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'step-ready',
      label: 'Ready for Table',
      statusMatch: ['ready', 'completed'],
      icon: <PartyPopper className="w-4 h-4" />,
    },
    {
      id: 'step-completed',
      label: 'Completed & Served',
      statusMatch: ['completed'],
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  // Helper to determine step status
  const getStepState = (stepIndex: number) => {
    const statusOrder: OrderStatusType[] = ['received', 'preparing', 'ready', 'completed'];
    const currentIdx = statusOrder.indexOf(status);

    // Map step indices:
    // 0 = Received (active if currentIdx >= 0)
    // 1 = Payment Confirmed (done if currentIdx >= 0)
    // 2 = Preparing (active if currentIdx === 1, done if currentIdx > 1)
    // 3 = Ready (active if currentIdx === 2, done if currentIdx > 2)
    // 4 = Completed (done if currentIdx === 3)
    if (stepIndex === 0) return 'done';
    if (stepIndex === 1) return 'done';
    if (stepIndex === 2) {
      if (currentIdx > 1) return 'done';
      if (currentIdx === 1) return 'active';
      return 'pending';
    }
    if (stepIndex === 3) {
      if (currentIdx > 2) return 'done';
      if (currentIdx === 2) return 'active';
      return 'pending';
    }
    if (stepIndex === 4) {
      if (currentIdx === 3) return 'done';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="w-full space-y-6">
      {/* Ready Alert Banner */}
      {status === 'ready' && (
        <div className="relative overflow-hidden bg-gradient-to-r from-star-gold/20 via-star-gold/10 to-transparent border border-star-gold/60 rounded-2xl p-5 gold-glow animate-bounce duration-1000">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-star-gold text-star-black shrink-0 font-extrabold shadow-lg">
              <PartyPopper className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-star-gold uppercase block">
                SPECIAL ALERT
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                🎉 YOUR ORDER IS READY
              </h3>
              <p className="text-xs text-zinc-200 mt-1 font-medium leading-relaxed">
                Your order is ready. Please collect it at the counter or wait for it to be delivered to your table.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tracker Container */}
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222222]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-star-gold">
              LIVE PROGRESS TRACKER
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {status === 'received' && 'Order received and sent to bar'}
              {status === 'preparing' && 'Your order is currently being prepared'}
              {status === 'ready' && 'Order ready for delivery to table'}
              {status === 'completed' && 'Order completed. Enjoy the event!'}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-star-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-star-gold" />
            </span>
            <span className="text-[11px] font-mono text-star-gold font-bold uppercase">
              {status}
            </span>
          </div>
        </div>

        {/* Vertical Stepper */}
        <div className="relative pl-6 sm:pl-8 space-y-6">
          {/* Vertical connecting line */}
          <div className="absolute left-[19px] sm:left-[27px] top-4 bottom-4 w-0.5 bg-[#262626]" />

          {steps.map((step, idx) => {
            const state = getStepState(idx);

            return (
              <div key={step.id} className="relative flex items-center gap-4">
                {/* Step node indicator */}
                <div
                  className={`relative z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs transition-all ${
                    state === 'done'
                      ? 'bg-star-gold text-star-black gold-glow-sm'
                      : state === 'active'
                      ? 'bg-star-gold/20 text-star-gold border-2 border-star-gold animate-gold-pulse'
                      : 'bg-[#222222] text-zinc-500 border border-[#333333]'
                  }`}
                >
                  {state === 'done' ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : state === 'active' ? (
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="font-mono text-[10px]">{idx + 1}</span>
                  )}
                </div>

                {/* Step Text */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold tracking-wide ${
                      state === 'done'
                        ? 'text-white'
                        : state === 'active'
                        ? 'text-star-gold font-bold'
                        : 'text-zinc-500 font-normal'
                    }`}
                  >
                    {step.label}
                  </p>
                  {state === 'active' && (
                    <p className="text-[11px] text-star-muted mt-0.5">In progress right now...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Status Switcher */}
        {allowSimulate && onSimulateStatus && (
          <div className="mt-8 pt-5 border-t border-[#222222]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Interactive Demo Controls:
              </span>
              <span className="text-[10px] text-star-gold/80 italic">
                Test state transitions
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['received', 'preparing', 'ready', 'completed'] as OrderStatusType[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onSimulateStatus(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      status === st
                        ? 'bg-star-gold text-star-black font-bold gold-glow-sm'
                        : 'bg-[#1D1D1D] text-zinc-400 hover:text-white hover:bg-[#252525] border border-[#2B2B2B]'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
