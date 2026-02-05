import { z } from 'zod';

export const dateOrString = z.preprocess((val) => {
  if (val == null || val === '') return undefined;
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val as string | number);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional());

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES: Xử lý người dùng, vai trò và quyền
// ═══════════════════════════════════════════════════════════════════════════════

export const PermissionSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  createdAt: dateOrString,
  modifiedAt: dateOrString,
  modifiedBy: z.string().optional(),
});

export const RoleSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  permissions: z.array(PermissionSchema).optional(),
  permissionIds: z.array(z.string()).optional(),
  createdAt: dateOrString,
  modifiedAt: dateOrString,
  modifiedBy: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().optional(),
  status: z.number().int(), // 0: inactive, 1: active, 2: banned
  roles: z.array(RoleSchema).optional(),
  roleIds: z.array(z.string()).optional(),
  createdAt: dateOrString,
  modifiedAt: dateOrString,
  modifiedBy: z.string().optional(),
});

export const LinkedAccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  provider: z.string(),
  providerId: z.string(),
  linkedAt: dateOrString,
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type LinkedAccount = z.infer<typeof LinkedAccountSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// USER TYPES: Xử lý hồ sơ và cài đặt người dùng
// ═══════════════════════════════════════════════════════════════════════════════

export const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string().min(2).max(100).trim().optional(),
  birthday: dateOrString,
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).trim().optional(),
  location: z.string().max(500).trim().optional(),
  updatedAt: dateOrString,
});

export type Profile = z.infer<typeof ProfileSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION TYPES: Xử lý tương tác
// ═══════════════════════════════════════════════════════════════════════════════

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  itemId: z.string().trim(),
  collectionId: z.string().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const CollectionSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  itemCount: z.number().int().min(0).optional(),
  isPublic: z.boolean().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  itemId: z.string().trim(),
  rating: z.number().min(0).max(5),
  content: z.string().trim().max(2000).optional(),
  isHidden: z.boolean().optional(),
  user: UserSchema.optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type Review = z.infer<typeof ReviewSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPES: Xử lý tài liệu, sách và tác giả
// ═══════════════════════════════════════════════════════════════════════════════

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(100),
  avatarUrl: z.string().url().trim().optional().or(z.literal('')),
  birthDate: dateOrString,
  nationality: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(1000).optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string().trim().min(1).max(100).optional(),
  parentId: z.string().nullable().optional(),
  translations: z.array(
    z.object({
      lang: z.string().min(2).max(5),
      name: z.string().trim().min(1).max(100),
      description: z.string().trim().max(500).optional(),
      createdAt: dateOrString,
      updatedAt: dateOrString,
    })
  )
    .optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const BookSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().max(255).optional(),
  description: z.string().trim().max(5000).optional(),
  publisher: z.string().trim().max(255).optional(),
  publishedDate: dateOrString,
  edition: z.string().trim().max(50).optional(),
  isbn: z.string().trim().max(20).optional(),
  language: z.string().trim().min(2).max(10).optional(),
  pages: z.number().int().min(0).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  coverUrl: z.string().trim().url().optional().or(z.literal('')),
  fileKey: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  updatedBy: z.string().trim().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  authors: z.array(AuthorSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  rating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().int().min(0).optional(),
  reviews: z.array(ReviewSchema).optional(),
  bookmarkId: z.string().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Book = z.infer<typeof BookSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// FILE TYPES: Xử lý file và tải lên
// ═══════════════════════════════════════════════════════════════════════════════

export const FileMetaSchema = z.object({
  id: z.string(),
  key: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  type: z.string(),
  size: z.number().int(),
  url: z.string(),
  provider: z.string(),
  uploadedBy: z.string(),
});

export type FileMeta = z.infer<typeof FileMetaSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// BORROW TYPES: Xử lý mượn sách
// ═══════════════════════════════════════════════════════════════════════════════

export const BorrowSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  borrower: UserSchema.optional(),
  itemId: z.string(),
  item: BookSchema.optional(),
  renewals: z.array(z.object({
    renewedAt: dateOrString,
    oldExpireTime: dateOrString,
    newExpireTime: dateOrString
  })),
  borrowTime: dateOrString,
  expireTime: dateOrString,
  returnTime: dateOrString.optional(),
  note: z.string().trim().optional(),
  status: z.enum(['active', 'returned', 'overdue', 'cancelled']),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export type Borrow = z.infer<typeof BorrowSchema>;
