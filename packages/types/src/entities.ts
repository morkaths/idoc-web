import { BorrowStatus, RoleType } from './enum';

// --- User & Authentication ---

export interface OAuthResponse {
  id: string;
  provider: string;
  providerId: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  role: RoleType;
  status: string;
  oauth?: OAuthResponse[];
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  type: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResponse {
  token: TokenResponse;
  user: UserResponse;
}

// --- Library Core ---

export interface CategoryTranslationResponse {
  lang: string;
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  slug: string;
  parent?: CategoryResponse;
  translations?: CategoryTranslationResponse[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthorResponse {
  id: string;
  name: string;
  avatar?: string;
  dob?: Date | string;
  nationality?: string;
  bio?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BookResponse {
  id: string;
  title: string;
  slug: string;
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
  fileId?: string;
  tags?: string[];
  rating?: number;
  bookmarkId?: string;
  totalReviews?: number;
  totalBorrows?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// --- Activities & Social ---

export interface BorrowResponse {
  id: string;
  book: BookResponse;
  user: UserResponse;
  borrowedDate: Date | string;
  dueDate: Date | string;
  returnDate?: Date | string;
  status: BorrowStatus;
  notes?: string;
  renewals?: {
    renewedAt: Date | string;
    oldDueDate: Date | string;
    newDueDate: Date | string;
  }[];
}

export interface ReviewResponse {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  content?: string;
  book?: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string;
  };
  user?: UserResponse;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BookmarkResponse {
  id: string;
  user: UserResponse;
  book: BookResponse;
  folder?: string;
  page?: number;
  note?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FolderResponse {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// --- Files ---

export interface FileResponse {
  id: string;
  fileName: string;
  objectKey: string;
  contentType: string;
  size: number;
  provider: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PresignedUploadResponse {
  uploadId: string;
  uploadUrl: string;
}
