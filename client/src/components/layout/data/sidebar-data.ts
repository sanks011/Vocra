import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  UserCheck,
  Building,
  ClipboardList,
  TrendingUp,
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { type NavGroup } from './types';

export interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navGroups: NavGroup[];
}

export const getRecruiterSidebarData = (user: any): SidebarData => ({
  user: {
    name: user?.name || 'Recruiter',
    email: user?.email || 'recruiter@example.com',
    avatar: user?.avatar || '/placeholder.svg',
  },
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Job Management',
      items: [
        {
          title: 'Job Postings',
          icon: Briefcase,
          items: [
            {
              title: 'All Jobs',
              url: '/jobs/manage',
              icon: ClipboardList,
            },
            {
              title: 'Create Job',
              url: '/jobs/create',
              icon: Sparkles,
            },
            {
              title: 'Job Analytics',
              url: '/jobs/analytics',
              icon: TrendingUp,
            },
          ],
        },
        {
          title: 'Candidates',
          icon: Users,
          items: [
            {
              title: 'All Candidates',
              url: '/candidates',
              icon: Users,
            },
            {
              title: 'Shortlisted',
              url: '/candidates/shortlisted',
              icon: UserCheck,
            },
            {
              title: 'Interview Pool',
              url: '/candidates/interviews',
              icon: Calendar,
            },
          ],
        },
      ],
    },
    {
      title: 'Interviews',
      items: [
        {
          title: 'Schedule Interview',
          url: '/interviews/schedule',
          icon: Calendar,
        },
        {
          title: 'AI Interviews',
          url: '/interviews/ai',
          icon: MessageSquare,
        },
        {
          title: 'Interview Reports',
          url: '/interviews/reports',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Company',
      items: [
        {
          title: 'Company Profile',
          url: '/company/profile',
          icon: Building,
        },
        {
          title: 'Team Management',
          url: '/company/team',
          icon: Users,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account Settings',
          url: '/settings/account',
          icon: Settings,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: Bell,
        },
        {
          title: 'Help & Support',
          url: '/help',
          icon: HelpCircle,
        },
      ],
    },
  ],
});

export const getCandidateSidebarData = (user: any): SidebarData => ({
  user: {
    name: user?.name || 'Candidate',
    email: user?.email || 'candidate@example.com',
    avatar: user?.avatar || '/placeholder.svg',
  },
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'My Profile',
          url: '/profile',
          icon: UserCheck,
        },
      ],
    },
    {
      title: 'Job Search',
      items: [
        {
          title: 'Browse Jobs',
          url: '/jobs',
          icon: Briefcase,
        },
        {
          title: 'My Applications',
          url: '/applications',
          icon: FileText,
        },
        {
          title: 'Saved Jobs',
          url: '/jobs/saved',
          icon: ClipboardList,
        },
      ],
    },
    {
      title: 'Interview Prep',
      items: [
        {
          title: 'Practice Interviews',
          url: '/practice',
          icon: MessageSquare,
        },
        {
          title: 'My Interviews',
          url: '/interviews',
          icon: Calendar,
        },
        {
          title: 'Interview Results',
          url: '/results',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          title: 'Skill Assessment',
          url: '/skills',
          icon: TrendingUp,
        },
        {
          title: 'Career Tips',
          url: '/resources',
          icon: HelpCircle,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account Settings',
          url: '/settings/account',
          icon: Settings,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: Bell,
        },
      ],
    },
  ],
});
