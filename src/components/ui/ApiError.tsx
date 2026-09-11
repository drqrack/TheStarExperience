'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ApiErrorProps {
  /** Error message to display */
  message?: string;
  /** Callback to retry the failed operation */
  onRetry?: () => void;
  /** Whether this is a connection/network error */
  isConnectionError?: boolean;
  /** Optional title override */
  title?: string;
}

export function ApiError({
  message = 'Something went wrong while loading data.',
  onRetry,
  isConnectionError = false,
  title,
}: ApiErrorProps) {
  const Icon = isConnectionError ? WifiOff : AlertTriangle;
  const displayTitle = title || (isConnectionError ? 'Connection Error' : 'Failed to Load');

  return (
    <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center bg-[#121212] border border-red-900/40 rounded-2xl">
      <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-red-400" />
      </div>

      <h4 className="text-white font-bold text-base mb-1">{displayTitle}</h4>

      <p className="text-star-muted text-xs mt-1 max-w-xs leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-star-gold text-white hover:text-star-black border border-[#333] hover:border-star-gold text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
