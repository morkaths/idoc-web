
export interface PermissionResponse {
  id: string;
  code?: string;
  name?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface RoleResponse {
  id: string;
  code?: string;
  name?: string;
  permissions?: PermissionResponse[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}


export interface UserResponse {
  id: string;
  email: string;
  username: string;
  password: string;
  status: number;
  roles?: RoleResponse[];
  linkedAccounts?: {
    provider: string;
    providerId: string;
    linkedAt: Date | string;
  }[];
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

export interface AuthorResponse {
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

export interface CategoryResponse {
  id: string;
  slug?: string;
  parent?: CategoryResponse;
  translations?: {
    lang: string;
    name: string;
    description?: string;
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BookResponse {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  categories?: CategoryResponse[];
  authors?: AuthorResponse[];
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

export interface FileResponse {
  id: string;
  originalname: string;
  url: string;
  size: number;
  mimetype: string;
  status: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BorrowResponse {
  id: string;
  borrower: UserResponse;
  item: BookResponse;
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

export interface ReviewResponse {
  id: string;
  item: BookResponse;
  user: UserResponse;
  rating: number;
  content?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BookmarkResponse {
  id: string;
  user: UserResponse;
  item: BookResponse;
  page?: number;
  note?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CollectionResponse {
  id: string;
  user: UserResponse;
  name: string;
  description?: string;
  bookmarks?: BookmarkResponse[];
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
  user: UserResponse;
  token: AuthToken;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  authenticated: boolean;
}