import React from 'react';
import { cn } from '@/lib/utils';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Main({ className, children, ...props }: MainProps) {
  return (
    <main
      className={cn(
        'flex flex-1 flex-col gap-4 p-6 pt-0 bg-[#131520]',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
