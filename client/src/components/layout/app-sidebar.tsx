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

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">Vocra AI</span>
        <span className="text-xs text-muted-foreground">Interview Platform</span>
      </div>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  
  // Get appropriate sidebar data based on user type
  const sidebarData = user?.userType === 'recruiter' 
    ? getRecruiterSidebarData(user)
    : getCandidateSidebarData(user);

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
