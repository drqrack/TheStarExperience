import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'gold',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-star-black select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-2 gap-1.5',
      md: 'text-sm px-4 py-3 gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
    };

    const variantStyles = {
      gold: 'bg-star-gold text-star-black hover:bg-star-gold-hover gold-glow focus:ring-star-gold shadow-lg shadow-star-gold/20 font-bold',
      outline:
        'border-2 border-star-gold text-star-gold hover:bg-star-gold/10 focus:ring-star-gold',
      secondary:
        'bg-[#1F1F1F] text-white border border-[#2D2D2D] hover:bg-[#282828] focus:ring-white/20',
      ghost: 'bg-transparent text-star-muted hover:text-white hover:bg-[#1A1A1A] focus:ring-white/20',
      danger:
        'bg-star-red/20 text-star-red border border-star-red/30 hover:bg-star-red/30 focus:ring-star-red',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
