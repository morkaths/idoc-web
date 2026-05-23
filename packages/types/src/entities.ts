import {
  AuthProvider,
  BorrowStatus,
  RecommendationStrategy,
  RoleType,
} from "./enum";

// --- User & Authentication ---

export interface OAuthResponse {
  id: string;
  provider: AuthProvider;
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

export namespace UserResponse {
  export interface Summary {
    id: string;
    username: string;
    avatar?: string;
  }
}

export type UserSummaryResponse = UserResponse.Summary;

export interface TokenResponse {
  accessToken: string;
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

export namespace AuthorResponse {
  export interface Summary {
    id: string;
    name: string;
    avatar?: string;
  }
}

export type AuthorSummaryResponse = AuthorResponse.Summary;

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
  isbn13?: string;
  language?: string;
  pages?: number;
  price?: number;
  stock?: number;
  coverUrl?: string;
  fileId?: string;
  tags?: string[];
  rating?: number;
  weightedRating?: number;
  totalReviews?: number;
  totalBorrows?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  isBookmarked?: boolean;
  bookmarkId?: string;
}

export namespace BookResponse {
  export interface Summary {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string;
    authors: AuthorResponse.Summary[];
  }
}

export type BookSummaryResponse = BookResponse.Summary;

// --- Activities & Social ---

export interface LoanResponse {
  id: string;
  book: BookResponse.Summary;
  user: UserResponse.Summary;
  borrowedDate: Date | string;
  dueDate: Date | string;
  returnDate?: Date | string;
  status: BorrowStatus;
  notes?: string;
  renewals?: LoanResponse.RenewalResponse[];
}

export namespace LoanResponse {
  export interface RenewalResponse {
    renewedAt: Date | string;
    oldDueDate: Date | string;
    newDueDate: Date | string;
  }
}

export interface ReviewResponse {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  content?: string;
  book?: BookResponse.Summary;
  user?: UserResponse.Summary;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BookmarkResponse {
  id: string;
  user: UserResponse.Summary;
  book: BookResponse.Summary;
  folder?: FolderResponse.Summary;
  createdAt: Date | string;
  page?: number;
  note?: string;
  updatedAt?: Date | string;
}

export namespace BookmarkResponse {
  export interface Summary {
    id: string;
    user: UserResponse.Summary;
    folder?: FolderResponse.Summary;
    book: BookResponse.Summary;
    createdAt: Date | string;
  }
}

export type BookmarkSummaryResponse = BookmarkResponse.Summary;

export interface FolderResponse {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export namespace FolderResponse {
  export interface Summary {
    id: string;
    name: string;
  }
}

export type FolderSummaryResponse = FolderResponse.Summary;

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

export interface RecommendationItem {
  id: string;
  score: number;
  reason?: string;
  predictedRating?: number;
}

export interface RecommendationResponse {
  userId: string;
  strategy: RecommendationStrategy;
  items: RecommendationItem[];
}

export interface RecommendedBookResponse extends BookResponse {
  score?: number;
  reason?: string;
}

// --- Agent Tasks & Evaluation ---

export interface RecommendationSyncResponse {
  count: number;
}

export interface RecommendationTrainResponse {
  [key: string]: any;
}

export interface RecommendationEvaluationMetrics {
  precisionAtK: number;
  recallAtK: number;
  ndcgAtK: number;
  mrr: number;
  mae: number;
  rmse: number;
  hitRate: number;
}

export interface RecommendationSparsityAnalysis {
  frequencyBuckets: {
    bucketName: string;
    userCount: number;
    precisionAtK: number;
    recallAtK: number;
    ndcgAtK: number;
  }[];
  longTailMetrics?: RecommendationEvaluationMetrics;
  cfOnlyMetrics?: RecommendationEvaluationMetrics;
  hybridMetrics?: RecommendationEvaluationMetrics;
  deltaNdcg?: number;
  deltaRmse?: number;
}

export interface RecommendationEvaluationResponse {
  strategy: RecommendationStrategy;
  metrics: RecommendationEvaluationMetrics;
  sampleSize: number;
  k: number;
  sparsityAnalysis?: RecommendationSparsityAnalysis;
}
