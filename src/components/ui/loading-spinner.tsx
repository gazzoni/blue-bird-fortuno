'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-black',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Carregando...', size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-8">
      <LoadingSpinner size={size} />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}