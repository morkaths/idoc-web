import { Library, Search, Zap, ShieldCheck, BarChart3, Globe, type LucideIcon } from 'lucide-react';

export type FeatureType = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const FEATURES: FeatureType[] = [
  {
    title: 'Digital Repository',
    description: 'Centralized cloud storage for E-books, journals, and multimedia assets.',
    icon: Library,
  },
  {
    title: 'AI Semantic Search',
    description: 'Instant, intelligent discovery using AI-powered recommendations.',
    icon: Search,
  },
  {
    title: 'Smart Circulation',
    description: 'Automated lending workflows with instant digital access control.',
    icon: Zap,
  },
  {
    title: 'DRM Protection',
    description: 'Enterprise-grade security and Digital Rights Management for assets.',
    icon: ShieldCheck,
  },
  {
    title: 'Usage Analytics',
    description: 'Deep insights into reading habits and collection engagement metrics.',
    icon: BarChart3,
  },
  {
    title: 'Anywhere Access',
    description: 'Seamless mobile-first experience available 24/7 on any device.',
    icon: Globe,
  },
];
