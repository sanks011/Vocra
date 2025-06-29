import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
