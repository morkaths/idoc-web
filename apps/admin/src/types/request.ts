import { z } from 'zod';

export const dateOrString = z.preprocess((val) => {
  if (val == null || val === '') return undefined;
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val as string | number);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional()) as z.ZodType<Date | undefined, any, any>;

export const PermissionRequestSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2),
  name: z.string().min(3),
});

export const RoleRequestSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2),
  name: z.string().min(3),
  permissions: z.array(z.string()).optional(),
});

export const UserRequestSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  status: z.number().int().optional(),
  roles: z.array(z.string()).optional(),
  profile: z.object({
    fullname: z.string().optional(),
    dob: dateOrString,
    bio: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export const LinkedAccountSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  provider: z.string(),
  providerId: z.string(),
  linkedAt: dateOrString,
});

export const AuthorRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(100),
  avatar: z.string().url().trim().optional().or(z.literal('')),
  dob: dateOrString,
  nationality: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(1000).optional(),
});

export const CategoryRequestSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1).max(100),
  parent: z.string().nullable().optional(),
  translations: z.array(
    z.object({
      lang: z.string().min(2).max(5),
      name: z.string().trim().min(1).max(100),
      description: z.string().trim().max(500).optional(),
    })
  ).optional(),
});

export const BookRequestSchema = z.object({
  id: z.string().optional(),
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
  file: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  authors: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export const FileRequestSchema = z.object({
  id: z.string().optional(),
  originalname: z.string(),
  objectname: z.string(),
  url: z.string(),
  size: z.number().int(),
  mimetype: z.string(),
  provider: z.string(),
  status: z.string(),
});

export const BorrowRequestSchema = z.object({
  id: z.string().optional(),
  borrower: z.string().trim().min(1, "User ID is required"),
  item: z.string().trim().min(1, "Item ID is required"),
  renewals: z.array(z.object({
    renewedAt: dateOrString,
    oldExpireTime: dateOrString,
    newExpireTime: dateOrString
  })).optional(),
  borrowTime: dateOrString.optional(),
  expireTime: dateOrString.optional(),
  returnTime: dateOrString.optional(),
  note: z.string().trim().optional(),
  status: z.string().optional(),
});

export const ReviewRequestSchema = z.object({
  id: z.string().optional(),
  item: z.string(),
  user: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1).max(5000),
});

export const BookmarkRequestSchema = z.object({
  id: z.string().optional(),
  user: z.string(),
  item: z.string(),
  page: z.number().int().min(0).optional(),
  note: z.string().trim().optional(),
});

export const CollectionRequestSchema = z.object({
  id: z.string().optional(),
  user: z.string().trim(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  itemCount: z.number().int().min(0).optional(),
  isPublic: z.boolean().optional()
});


export type PermissionRequest = z.infer<typeof PermissionRequestSchema>;
export type RoleRequest = z.infer<typeof RoleRequestSchema>;
export type UserRequest = z.infer<typeof UserRequestSchema>;
export type LinkedAccountRequest = z.infer<typeof LinkedAccountSchema>;
export type AuthorRequest = z.infer<typeof AuthorRequestSchema>;
export type CategoryRequest = z.infer<typeof CategoryRequestSchema>;
export type BookRequest = z.infer<typeof BookRequestSchema>;
export type FileRequest = z.infer<typeof FileRequestSchema>;
export type BorrowRequest = z.infer<typeof BorrowRequestSchema>;
export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;
export type BookmarkRequest = z.infer<typeof BookmarkRequestSchema>;
export type CollectionRequest = z.infer<typeof CollectionRequestSchema>;