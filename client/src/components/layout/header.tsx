import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-800/50',
        className
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-2 px-4">
        {children}
      </div>
    </header>
  );
}
