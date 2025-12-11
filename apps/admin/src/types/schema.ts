import { z } from 'zod'

export const dateOrString = z.preprocess((val) => {
  if (val == null || val === '') return undefined
  if (val instanceof Date) return val
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val as any)
    return isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}, z.date().optional())

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
})

export const RoleSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  permissions: z.array(PermissionSchema),
  createdAt: dateOrString,
  modifiedAt: dateOrString,
  modifiedBy: z.string().optional(),
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().optional(),
  status: z.number().int(), // 0: inactive, 1: active, 2: banned
  roles: z.array(RoleSchema),
  createdAt: dateOrString,
  modifiedAt: dateOrString,
  modifiedBy: z.string().optional(),
})

export const LinkedAccountSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  provider: z.string(),
  providerId: z.string(),
  linkedAt: dateOrString,
})

export type Permission = z.infer<typeof PermissionSchema>
export type Role = z.infer<typeof RoleSchema>
export type User = z.infer<typeof UserSchema>
export type LinkedAccount = z.infer<typeof LinkedAccountSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// USER TYPES: Xử lý hồ sơ và cài đặt người dùng
// ═══════════════════════════════════════════════════════════════════════════════
export const ProfileSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  fullName: z.string().optional(),
  birthday: dateOrString,
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  updatedAt: dateOrString,
})

const ThemeSchema = z
  .object({
    mode: z.enum(['light', 'dark', 'system']).optional(),
    layout: z.enum(['vertical', 'horizontal']).optional(),
    language: z.string().optional(),
  })
  .optional()

const NotificationsSchema = z
  .object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
  })
  .optional()

export const SettingsSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  theme: ThemeSchema,
  notifications: NotificationsSchema,
  updatedAt: dateOrString,
})

export type Profile = z.infer<typeof ProfileSchema>
export type Settings = z.infer<typeof SettingsSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPES: Xử lý tài liệu, sách và tác giả
// ═══════════════════════════════════════════════════════════════════════════════
export const AuthorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  birthDate: dateOrString,
  nationality: z.string().optional(),
  bio: z.string().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
})

export const CategorySchema = z.object({
  _id: z.string(),
  slug: z.string().optional(),
  parentId: z.string().optional(),
  translations: z
    .array(
      z.object({
        lang: z.string(),
        name: z.string(),
        description: z.string().optional(),
        createdAt: dateOrString,
        updatedAt: dateOrString,
      })
    )
    .optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
})

export const BookSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  publisher: z.string().optional(),
  publishedDate: dateOrString,
  edition: z.string().optional(),
  isbn: z.string().optional(),
  language: z.string().optional(),
  pages: z.number().int().optional(),
  price: z.number().optional(),
  stock: z.number().int().optional(),
  coverUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
  updatedBy: z.string().optional(),
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  authors: z.array(AuthorSchema).optional(),
  categories: z.array(CategorySchema).optional(),
})

export type Author = z.infer<typeof AuthorSchema>
export type Category = z.infer<typeof CategorySchema>
export type Book = z.infer<typeof BookSchema>
