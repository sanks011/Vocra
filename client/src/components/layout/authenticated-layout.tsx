import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/layout/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  // Get sidebar state from localStorage or default to true
  const defaultOpen = localStorage.getItem('sidebar_state') !== 'false';
  
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />      <div
        id='content'
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:md:w-[calc(100%-3.5rem)]',
          'peer-data-[state=expanded]:md:w-[calc(100%-16rem)]',
          'transition-all duration-200 ease-linear',
          'flex h-svh flex-col',
          'bg-[#131520] text-white',
          'relative'
        )}
      >
        {children}
      </div>
    </SidebarProvider>
  );
}
