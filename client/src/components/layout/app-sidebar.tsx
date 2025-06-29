import React from 'react';
import { Sparkles } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/layout/sidebar';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { getRecruiterSidebarData, getCandidateSidebarData } from './data/sidebar-data';
import { useAuth } from '@/context/AuthContext';

function SidebarLogo() {  return (    <div className="flex items-center justify-center gap-2 px-2 py-2 w-full">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#1A1E2A] text-white shrink-0">
        <Sparkles className="size-4 text-gray-100" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none group-data-[state=collapsed]:hidden">
        <span className="font-semibold text-white">Vocra</span>
        <span className="text-xs text-gray-400">Interview Platform</span>
      </div>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  
  // Get appropriate sidebar data based on user type
  const sidebarData = user?.userType === 'recruiter' 
    ? getRecruiterSidebarData(user)
    : getCandidateSidebarData(user);  return (
    <Sidebar collapsible='icon' variant='inset' className="flex flex-col items-center" {...props}>
      <SidebarHeader className="w-full">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="w-full flex-grow flex flex-col items-center">
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter className="w-full">
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
