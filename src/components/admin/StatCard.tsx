import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: 'gold' | 'blue' | 'green' | 'red' | 'neutral';
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  variant = 'gold',
  highlight = false,
}: StatCardProps) {
  const variantStyles = {
    gold: 'border-star-gold/30 bg-star-gold/5 text-star-gold',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    green: 'border-star-green/30 bg-star-green/5 text-star-green',
    red: 'border-star-red/30 bg-star-red/5 text-star-red',
    neutral: 'border-[#2A2A2A] bg-[#141414] text-zinc-300',
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#141414] border rounded-2xl p-4 sm:p-5 shadow-lg transition-all ${
        highlight
          ? 'border-star-gold/60 gold-glow-sm'
          : 'border-[#262626] hover:border-[#333333]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-star-muted">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border ${variantStyles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
