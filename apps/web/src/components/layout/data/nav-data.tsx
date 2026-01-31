import {
  LucideProps,
  HomeIcon,
  StarIcon,
  UserIcon,
  CompassIcon,
  TrendingUpIcon,
  LibraryIcon,
  BookmarkIcon,
  BookOpenIcon,
  HistoryIcon,
  Tag,
  Sparkles
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useLocale } from "@/hooks/ui/useLocale";

export type NavDropdownItem = {
  title: string;
  href: string;
  description?: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

export type NavItem = {
  label: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  href?: string;
  dropdown?: NavDropdownItem[];
  hero?: {
    title: string;
    image: string;
    href: string;
  };
};

export function useNavData(): NavItem[] {
  const { t, keys } = useLocale('navigation');

  return [
    {
      label: t(keys.home),
      icon: HomeIcon,
      href: "/",
    },
    {
      label: t(keys.catalog.label),
      icon: LibraryIcon,
      dropdown: [
        {
          title: t(keys.catalog.discover.title),
          icon: Sparkles,
          href: "/books/discover",
          description: t(keys.catalog.discover.description),
        },
        {
          title: t(keys.catalog.newArrivals.title),
          icon: CompassIcon,
          href: "/books/new",
          description: t(keys.catalog.newArrivals.description),
        },
        {
          title: t(keys.catalog.popular.title),
          icon: TrendingUpIcon,
          href: "/books/popular",
          description: t(keys.catalog.popular.description),
        },
        {
          title: t(keys.catalog.categories.title),
          icon: Tag,
          href: "/books/categories",
          description: t(keys.catalog.categories.description),
        },
      ],
      hero: {
        title: "Digital Library",
        image: "https://i.pinimg.com/1200x/47/5f/40/475f4037d1df064b68d51516ee148b96.jpg",
        href: "/books",
      },
    },
    {
      label: t(keys.authors.label),
      icon: UserIcon,
      dropdown: [
        {
          title: t(keys.authors.featured.title),
          icon: TrendingUpIcon,
          href: "/authors/featured",
          description: t(keys.authors.featured.description),
        },
        {
          title: t(keys.authors.directory.title),
          icon: StarIcon,
          href: "/authors/directory",
          description: t(keys.authors.directory.description),
        },
      ],
      hero: {
        title: "Authors Hub",
        image: "https://i.pinimg.com/1200x/3f/58/f8/3f58f845c93ca0120d51da68763f290b.jpg",
        href: "/authors",
      },
    },

    {
      label: t(keys.library.label),
      icon: BookmarkIcon,
      dropdown: [
        {
          title: t(keys.library.borrowed.title),
          icon: BookOpenIcon,
          href: "/library/borrowed",
          description: t(keys.library.borrowed.description),
        },
        {
          title: t(keys.library.wishlist.title),
          icon: StarIcon,
          href: "/library/wishlist",
          description: t(keys.library.wishlist.description),
        },
        {
          title: t(keys.library.history.title),
          icon: HistoryIcon,
          href: "/library/history",
          description: t(keys.library.history.description),
        },
      ],
      hero: {
        title: "Library Center",
        image: "https://i.pinimg.com/1200x/cb/43/ee/cb43eec212897418bcaf7b25d129b0b1.jpg",
        href: "/library",
      },
    },
  ];
}