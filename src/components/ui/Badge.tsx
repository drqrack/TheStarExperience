import React from 'react';

export type BadgeVariant =
  | 'gold'
  | 'green'
  | 'blue'
  | 'red'
  | 'neutral'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'gold',
  size = 'md',
  pulse = false,
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wider font-semibold',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    gold: 'bg-star-gold/15 text-star-gold border border-star-gold/30',
    green: 'bg-star-green/15 text-star-green border border-star-green/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    red: 'bg-star-red/15 text-star-red border border-star-red/30',
    neutral: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    outline: 'border border-zinc-700 text-zinc-400 bg-transparent',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === 'gold'
                ? 'bg-star-gold'
                : variant === 'green'
                ? 'bg-star-green'
                : 'bg-red-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              variant === 'gold'
                ? 'bg-star-gold'
                : variant === 'green'
                ? 'bg-star-green'
                : 'bg-red-500'
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
