import { z } from "zod";
import {
  AuthProvider,
  BorrowStatus,
  RecommendationStrategy,
  RoleType,
  UserStatus,
} from "./enum";

export const dateOrString = z.preprocess((val) => {
  if (val == null || val === "") return undefined;
  if (val instanceof Date) return val;
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val as string | number);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional()) as z.ZodType<Date | undefined, any, any>;

export const UserRequestSchema = z.object({
  email: z.string().email().max(100),
  username: z.string().min(3).max(50),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .optional(),
  avatar: z.string().max(1000).optional(),
  bio: z.string().max(500).optional(),
  role: z.nativeEnum(RoleType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const SignInRequestSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(1),
});

export const SignUpRequestSchema = z.object({
  email: z.string().email().max(100),
  username: z.string().min(3).max(50),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

export const ChangePasswordRequestSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

export const ResetPasswordRequestSchema = z.object({
  email: z.string().email().max(100),
  otp: z.string().min(6).max(6),
  newPassword: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

export const LinkedAccountSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  provider: z.nativeEnum(AuthProvider),
  providerId: z.string(),
  linkedAt: dateOrString,
});

export const VerifyEmailRequestSchema = z.object({
  email: z.string().email().max(100),
  otp: z.string().min(6).max(6),
});

export const CategoryTranslationRequestSchema = z.object({
  lang: z.string().min(2).max(5),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
});

export const CategoryRequestSchema = z.object({
  slug: z.string().trim().min(1).max(255),
  parentId: z.string().uuid().optional(),
  translations: z.array(CategoryTranslationRequestSchema).min(1),
});

export const AuthorRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  avatar: z.string().trim().max(1000).optional(),
  dob: dateOrString,
  nationality: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(5000).optional(),
});

export const BookRequestSchema = z.object({
  title: z.string().trim().min(1).max(500),
  slug: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().max(10000).optional().or(z.literal("")),
  categoryIds: z.array(z.string().uuid()).min(1),
  authorIds: z.array(z.string().uuid()).min(1),
  publisher: z.string().trim().max(255).optional().or(z.literal("")),
  publishedDate: dateOrString,
  edition: z.string().trim().max(100).optional().or(z.literal("")),
  isbn: z.string().trim().max(50).optional().or(z.literal("")),
  language: z.string().trim().max(50).optional().or(z.literal("")),
  pages: z.coerce.number().int().nonnegative().optional(),
  price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  coverUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  fileId: z.string().uuid().optional().or(z.literal("")),
  tags: z.array(z.string().trim()).optional(),
});

export const FileRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string().optional(),
});

export const PresignedUploadRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string().optional(),
  folder: z.string().optional(),
});

export const BorrowRequestSchema = z.object({
  userId: z.string().uuid(),
  bookId: z.string().uuid(),
  dueDate: dateOrString,
  status: z.nativeEnum(BorrowStatus),
  notes: z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.split(/\s+/).filter(Boolean).length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Notes cannot exceed 500 words",
        });
      }
    }),
});

export const RenewBorrowRequestSchema = z.object({
  extraDays: z.number().int().min(1).max(30),
  notes: z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.split(/\s+/).filter(Boolean).length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Notes cannot exceed 500 words",
        });
      }
    }),
});

export const ReviewRequestSchema = z.object({
  bookId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1).max(5000),
});

export const BookmarkRequestSchema = z.object({
  bookId: z.string().uuid(),
  folderId: z.string().uuid().optional(),
});

export const FolderRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export const RecommendationRequestSchema = z.object({
  strategy: z.nativeEnum(RecommendationStrategy).optional(),
});

export type UserRequest = z.infer<typeof UserRequestSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type LinkedAccountRequest = z.infer<typeof LinkedAccountSchema>;

export type AuthorRequest = z.infer<typeof AuthorRequestSchema>;
export type CategoryTranslationRequest = z.infer<
  typeof CategoryTranslationRequestSchema
>;
export type CategoryRequest = z.infer<typeof CategoryRequestSchema>;
export type BookRequest = z.infer<typeof BookRequestSchema>;
export type FileRequest = z.infer<typeof FileRequestSchema>;
export type PresignedUploadRequest = z.infer<
  typeof PresignedUploadRequestSchema
>;
export type BorrowRequest = z.infer<typeof BorrowRequestSchema>;
export type RenewBorrowRequest = z.infer<typeof RenewBorrowRequestSchema>;
export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;
export type BookmarkRequest = z.infer<typeof BookmarkRequestSchema>;
export type FolderRequest = z.infer<typeof FolderRequestSchema>;
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
