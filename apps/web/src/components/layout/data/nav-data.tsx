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
        title: "Discover",
        icon: Sparkles,
        href: "/books/discover",
        description: "Explore curated collections and recommendations tailored for you.",
      },
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
      image: "https://i.pinimg.com/1200x/47/5f/40/475f4037d1df064b68d51516ee148b96.jpg",
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
      image: "https://i.pinimg.com/1200x/3f/58/f8/3f58f845c93ca0120d51da68763f290b.jpg",
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
    hero: {
      title: "Library Center",
      image: "https://i.pinimg.com/1200x/cb/43/ee/cb43eec212897418bcaf7b25d129b0b1.jpg",
      href: "/library",
    },
  },
];