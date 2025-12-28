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
  Tag
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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
    description: string;
    href: string;
  };
};

export const NavComponents: NavItem[] = [
  {
    label: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    label: "Catalog",
    icon: LibraryIcon,
    dropdown: [
      {
        title: "New Arrivals",
        icon: CompassIcon,
        href: "/books/new",
        description: "The latest additions to our collection this week.",
      },
      {
        title: "Popular",
        icon: TrendingUpIcon,
        href: "/books/popular",
        description: "Most borrowed and highly rated books by our community.",
      },
      {
        title: "Categories",
        icon: Tag,
        href: "/books/categories",
        description: "Browse by Science, Fiction, History, Self-help, and more.",
      },
    ],
    hero: {
      title: "Digital Library",
      description: "Access thousands of e-books, research papers, and journals anytime, anywhere.",
      href: "/books",
    },
  },
  {
    label: "Authors",
    icon: UserIcon,
    dropdown: [
      {
        title: "Featured",
        icon: TrendingUpIcon,
        href: "/authors/featured",
        description: "Spotlight on award-winning writers and their masterpieces.",
      },
      {
        title: "Directory",
        icon: StarIcon,
        href: "/authors/directory",
        description: "Explore biographies and bibliographies of all authors.",
      },
    ],
    hero: {
      title: "Authors Hub",
      description: "Discover author interviews, writing tips, and upcoming book releases.",
      href: "/authors",
    },
  },
  {
    label: "Library",
    icon: BookmarkIcon,
    dropdown: [
      {
        title: "Borrowed",
        icon: BookOpenIcon,
        href: "/library/borrowed",
        description: "Books you have currently borrowed from the library.",
      },
      {
        title: "Wish List",
        icon: StarIcon,
        href: "/library/wishlist",
        description: "Books you have added to your wish list for future borrowing.",
      },
      {
        title: "History",
        icon: HistoryIcon,
        href: "/library/history",
        description: "Your borrowing history and past interactions with the library.",
      },
    ],
  },
];