import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Package,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  AudioWaveform,
  GalleryVerticalEnd,
  Library,
  Tag,
  UserPen,
  Bookmark,
  Sparkles,
  Database,
} from 'lucide-react';
import { ClerkLogo } from '@/assets/clerk-logo';
import { Logo } from '../logo';
import { type SidebarData } from '../types';

export const sidebarData: SidebarData = {
  user: {
    name: 'Vuong',
    email: 'morkaths@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'iDoc Admin',
      logo: Logo,
      plan: 'Library Management',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'Manage',
      items: [
        {
          title: 'Books',
          url: '/books',
          icon: Library,
        },
        {
          title: 'Categories',
          url: '/categories',
          icon: Tag,
        },
        {
          title: 'Authors',
          url: '/authors',
          icon: UserPen,
        },
        {
          title: 'Borrows',
          url: '/borrows',
          icon: Bookmark,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Recommendations',
          url: '/recommendations',
          icon: Sparkles,
        },
        {
          title: 'Storage',
          url: '/storage',
          icon: Database,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
};
