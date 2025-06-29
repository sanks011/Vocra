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
      <AppSidebar />
      <div
        id='content'
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'flex h-svh flex-col',
          'bg-black text-white'
        )}
      >
        {children}
      </div>
    </SidebarProvider>
  );
}
