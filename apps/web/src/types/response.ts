
export interface Permission {
  id: string;
  code?: string;
  name?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Role {
  id: string;
  code?: string;
  name?: string;
  permissions?: Permission[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface LinkedAccount {
  provider: string;
  providerId: string;
  linkedAt: Date | string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  status: number;
  roles?: Role[];
  linkedAccounts?: LinkedAccount[];
  profile?: {
    fullname?: string;
    dob?: Date | string;
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
  };
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  dob?: Date | string;
  nationality?: string;
  bio?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CategoryTranslation {
  lang: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  slug?: string;
  parent?: Category;
  translations?: CategoryTranslation[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Book {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  categories?: Category[];
  authors?: Author[];
  publisher?: string;
  publishedDate?: Date | string;
  edition?: string;
  isbn?: string;
  language?: string;
  pages?: number;
  price?: number;
  stock?: number;
  coverUrl?: string;
  file?: string;
  tags?: string[];
  bookmarkId?: string;
  rating?: number;
  totalReviews?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface File {
  id: string;
  originalname: string;
  url: string;
  size: number;
  mimetype: string;
  status: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Borrow {
  id: string;
  borrower: User;
  item: Book;
  renewals?: {
    renewedAt: Date | string;
    oldExpireTime: Date | string;
    newExpireTime: Date | string;
  }[];
  borrowTime: Date | string;
  expireTime: Date | string;
  returnTime?: Date | string;
  note?: string;
  status: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Review {
  id: string;
  item: Book;
  user: User;
  rating: number;
  content?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Bookmark {
  id: string;
  user: User;
  item: Book;
  page?: number;
  note?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Collection {
  id: string;
  user: User;
  name: string;
  description?: string;
  bookmarks?: Bookmark[];
  itemCount?: number;
  isPublic?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FindParams {
  page?: number;
  limit?: number;
  query?: string;
  sorts?: Record<string, string>[];
  filters?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface BaseResponse {
  success: boolean;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data?: T;
  pagination?: Pagination;
}

export interface ErrorResponse extends BaseResponse {
  errors?: string[];
}

export interface AuthenticationResponse {
  user: User;
  token: AuthToken;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  authenticated: boolean;
}